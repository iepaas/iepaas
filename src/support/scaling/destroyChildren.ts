import { Child } from "@iepaas/model"
import { getChildrenAdapter } from "@iepaas/db-adapter"
import { getMachineProvider } from "../getMachineProvider"
import { updateNginxConfig } from "../nginx/updateNginxConfig"
import { childToMachine } from "../misc/jobToMachine"

export async function destroyChildren(children: Array<Child>) {
	const [Children, Provider] = await Promise.all([
		getChildrenAdapter(),
		getMachineProvider()
	])

	children.forEach(child => {
		if (child.isJob) {
			// Jobs cannot be manually destroyed. They will be destroyed when
			// they finish their work.
			throw new Error(`Attempt to destroy job #${child.id}`)
		}
	})

	await Promise.all(children.map(async child => {
		console.log(`Destroying child #${child.id}...`)
		await Children.update(child, {isTerminated: true})
	}))

	await updateNginxConfig()

	await Promise.all(children.map(child => Provider.destroyMachine(childToMachine(child))))
}