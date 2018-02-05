import { Router } from "express"
import { createApiKeyValidations } from "./validations/createApiKeyValidations"
import { createApiKey } from "./createApiKey"
import { methodNotAllowed } from "../../../support/methodNotAllowed"

const router = Router()

router
	.route("/")
	.post(createApiKeyValidations, createApiKey)
	.all(methodNotAllowed)

// TODO allow managing api keys

export { router as apiKeys }
