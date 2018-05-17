import { Router } from "express"
import { json as jsonParser } from "body-parser"
import { authenticate } from "../middleware/authenticate"
import { apiKeys } from "./apiKeys"
import { sshKeys } from "./sshKeys"
import { jobs } from "./jobs"
import { domains } from "./domains"
import { internal } from "./internal"

const router = Router()

router.use(jsonParser())

router.use(authenticate)

router.use("/apiKeys", apiKeys)
router.use("/sshKeys", sshKeys)
router.use("/jobs", jobs)
router.use("/domains", domains)
router.use("/internal", internal)

export { router as api }
