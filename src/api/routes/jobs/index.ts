import { Router } from "express"
import { methodNotAllowed } from "../../../support/methodNotAllowed"
import { createJob } from "./createJob"
import { createJobValidations } from "./validations/createJobValidations"

const router = Router()

router
	.route("/")
	.post(createJobValidations, createJob)
	.all(methodNotAllowed)

export { router as jobs }
