import { Router } from "express"
import { initializeIepaasValidations } from "./validations/initializeIepaasValidations"
import { initializeIepaas } from "./initializeIepaas"
import { methodNotAllowed } from "../../middleware/methodNotAllowed"

const router = Router()

router
	.route("/")
	.post(initializeIepaasValidations, initializeIepaas)
	.all(methodNotAllowed)

export { router as init }
