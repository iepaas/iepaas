import { body } from "express-validator/check"

export const createDomainValidations = [
	body("name").isLength({min: 3})
]
