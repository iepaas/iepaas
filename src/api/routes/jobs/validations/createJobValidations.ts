import { body } from "express-validator/check"

export const createJobValidations = [
	body("processId")
		.isNumeric()
		.optional({ nullable: true }),
	body("command")
		.isLength({ min: 1 })
		.optional({ nullable: true })
]
