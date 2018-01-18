import * as Git from "nodegit"
import { Config } from "@iepaas/db-adapter"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../../support/createController"
import { generateError } from "../../../support/generateError"
import { REPO_URL } from "../../../configKeys"
import { createBuild } from "../../../support/builds/createBuild"
import { launchChildren } from "../../../support/scaling/launchChildren"

export const initializeIepaas = createController(async req => {
	if (await Config.get(REPO_URL)) {
		return generateError("IEPAAS_ALREADY_INITIALIZED")
	}

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const { repoUrl, config } = matchedData(req)
	let commit: string

	try {
		const repo = await Git.Clone.clone(repoUrl, "/app")
		commit = (await repo.getHeadCommit()).sha()
	} catch (e) {
		return generateError("REPO_INVALID")
	}

	// TODO handle errors here
	const build = await createBuild(commit)
	// TODO test
	await launchChildren(build, "npm start", 1)

	await Promise.all([
		...Object.keys(config).map(key => Config.set(key, config[key])),
		Config.set(REPO_URL, repoUrl)
	])

	return [200]
})
