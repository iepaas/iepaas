import { body } from "express-validator/check"

export const createApiKeyValidations = [
	body("label").isLength({ min: 1, max: 30 })
]
