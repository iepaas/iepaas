import { Router } from "express"
import { methodNotAllowed } from "../../../support/methodNotAllowed"
import { createSSHKeyValidations } from "./validations/createSSHKeyValidations"
import { createSSHKey } from "./createSSHKey"

const router = Router()

router
	.route("/")
	.post(createSSHKeyValidations, createSSHKey)
	.all(methodNotAllowed)

export { router as sshKeys }
