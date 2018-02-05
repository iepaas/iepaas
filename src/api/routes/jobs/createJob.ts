import { getProcessesAdapter } from "@iepaas/db-adapter"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../../support/createController"
import { generateError } from "../../../support/generateError"
import { launchChildren } from "../../../support/scaling/launchChildren"
import { getLatestBuild } from "../../../support/builds/getLatestBuild"

// TODO test this

export const createJob = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req) as any

	const build = await getLatestBuild()

	if (!build) {
		return generateError("APP_NOT_BUILT")
	}

	let command

	if (data.command) {
		command = data.command
	} else {
		const Processes = await getProcessesAdapter()
		const process = await Processes.findById(data.processId)

		if (process) {
			command = process.command
		} else {
			return [
				404,
				{
					error: "PROCESS_NOT_FOUND",
					message: `There is no process with ID ${data.processId}`
				}
			]
		}
	}

	// TODO make jobs auto-terminate on exit
	await launchChildren({
		build,
		quantity: 1,
		isJob: true,
		command
	})

	return [200]
})
