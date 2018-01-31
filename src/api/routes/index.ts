import { Router } from "express"
import { json as jsonParser } from "body-parser"
import { authenticate } from "../middleware/authenticate"
import { apiKeys } from "./apiKeys"
import { sshKeys } from "./sshKeys"

const router = Router()

router.use(jsonParser())

router.use(authenticate)

router.use("/apiKeys", apiKeys)
router.use("/sshKeys", sshKeys)

export { router as api }
