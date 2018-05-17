import { Router } from "express"
import { methodNotAllowed } from "../../../support/methodNotAllowed"
import { createJob } from "./createJob"
import { createJobValidations } from "./validations/createJobValidations"
import { selfDestructMachine } from "../internal/selfDestructMachine"

const router = Router()

router
	.route("/")
	.post(createJobValidations, createJob)
	.delete(selfDestructMachine)
	.all(methodNotAllowed)

export { router as jobs }
