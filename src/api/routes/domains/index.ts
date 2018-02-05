import { Router } from "express"
import { methodNotAllowed } from "../../../support/methodNotAllowed"
import { getAllDomains } from "./getAllDomains"
import { createDomainValidations } from "./validations/createDomainValidation"
import { createDomain } from "./createDomain"
import { queryDomain } from "./queryDomain"
import { getDomain } from "./getDomain"
import { deleteDomain } from "./deleteDomain"

const router = Router()

router
	.route("/")
	.get(getAllDomains)
	.post(createDomainValidations, createDomain)
	.all(methodNotAllowed)

router.use("/:id", queryDomain)

router
	.route("/:id")
	.get(getDomain)
	.delete(deleteDomain)
	.all(methodNotAllowed)

export { router as domains }
