import * as fs from "fs"
import {promisify} from "util"
import { validationResult } from "express-validator/check"
import { createController } from "../../../support/createController"
import { generateError } from "../../../support/generateError"
import { matchedData } from "express-validator/filter"

const appendFile = promisify(fs.appendFile)

export const createSSHKey = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req) as any

	await appendFile("/home/ubuntu/.ssh/authorized_keys", data.key.trim())

	return [200]
})
