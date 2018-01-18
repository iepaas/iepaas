import { body } from "express-validator/check"

export const initializeIepaasValidations = [
	body("repoUrl").exists(),
	body("config").custom(it => typeof it === "object")
]
