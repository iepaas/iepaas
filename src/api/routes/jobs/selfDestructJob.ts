import { ApiKey, Child } from "@iepaas/model"
import { getChildrenAdapter } from "@iepaas/db-adapter"
import { createController } from "../../../support/createController"
import { getMachineProvider } from "../../../support/getMachineProvider"
import { childToMachine } from "../../../support/misc/jobToMachine"

export const selfDestructJob = createController(async req => {
	if (req.authentication instanceof ApiKey) {
		return [
			403,
			{
				error: "NOT_A_CHILD",
				message: "Only children are allowed to call this endpoint"
			}
		]
	}

	if (!req.authentication.isJob) {
		return [
			403,
			{
				error: "NOT_A_JOB",
				message: "Only jobs are allowed to call this endpoint"
			}
		]
	}

	const child: Child = req.authentication

	const Provider = await getMachineProvider()

	Provider.destroyMachine(childToMachine(child))
		.then(() => getChildrenAdapter())
		.then(A => A.update(child, { isTerminated: true }))
		.catch(err => {
			console.error("Failed to terminate a job!")
			console.error(err)
		})

	console.log(`The job from machine ${child.machineId} finished`)

	return [202]
})
