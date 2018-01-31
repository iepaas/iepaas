import { getApiKeysAdapter } from "@iepaas/db-adapter"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../../support/createController"
import { generateError } from "../../../support/generateError"

export const createApiKey = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req) as any

	const apiKey = await (await getApiKeysAdapter()).insert(data)

	return [
		200,
		{
			...apiKey.serialize(),
			value: apiKey.value
		}
	]
})
