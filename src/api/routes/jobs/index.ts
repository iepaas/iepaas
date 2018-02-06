import { Router } from "express"
import { methodNotAllowed } from "../../../support/methodNotAllowed"
import { createJob } from "./createJob"
import { createJobValidations } from "./validations/createJobValidations"
import { selfDestructJob } from "./selfDestructJob"

const router = Router()

router
	.route("/")
	.post(createJobValidations, createJob)
	.delete(selfDestructJob)
	.all(methodNotAllowed)

export { router as jobs }
