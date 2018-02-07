import { getChildrenAdapter, getProcessesAdapter } from "@iepaas/db-adapter"
import { launchChildren } from "./launchChildren"
import { getLatestBuild } from "../builds/getLatestBuild"
import { oneLine } from "common-tags"
import { destroyChildren } from "./destroyChildren"

// TODO test

export async function ensureCorrectProcessQuantities() {
	const Children = await getChildrenAdapter()
	const Processes = await getProcessesAdapter()

	const [processes, children, build] = await Promise.all([
		Processes.findAll(),
		Children.findAllActive(),
		getLatestBuild()
	])

	if (build === null) {
		// The app hasn't been built yet, nothing to do
		return
	}

	await Promise.all(processes.map(async process => {
		const processChildren = children.filter(it => it.process && it.process.id === process.id)

		const missingChildren = processChildren.length - process.targetQuantity

		console.log(oneLine`There is a ${-missingChildren} difference of 
			children in the ${process.name} process (target = 
			${process.targetQuantity}, actual = ${processChildren.length})`)

		if (missingChildren > 0) {
			await launchChildren({
				build,
				process,
				quantity: missingChildren,
				isJob: false
			})
		} else if (missingChildren < 0) {
			// In case we have an excess, destroy the oldest children
			const childrenToDestroy = processChildren
				.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
				.slice(0, Math.abs(missingChildren) - 1)

			await destroyChildren(childrenToDestroy)
		}
	}))
}