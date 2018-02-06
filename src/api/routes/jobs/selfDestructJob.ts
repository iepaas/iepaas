import { ApiKey } from "@iepaas/model"
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

	const Provider = await getMachineProvider()

	Provider.destroyMachine(childToMachine(req.authentication)).catch(err => {
		console.error("Failed to terminate a job!")
		console.error(err)
	})

	return [202]
})
