import { getDomainsAdapter } from "@iepaas/db-adapter"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../../support/createController"
import { generateError } from "../../../support/generateError"

export const createDomain = createController(async req => {
	const Domains = await getDomainsAdapter()

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req) as any

	const domain = await Domains.insert(data)

	return [200, domain.serialize()]
})
