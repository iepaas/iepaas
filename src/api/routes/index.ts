import { Router } from "express"
import { json as jsonParser } from "body-parser"
import { authenticate } from "../middleware/authenticate"
import { apiKeys } from "./apiKeys"

const router = Router()

router.use(jsonParser())

router.use(authenticate)

router.use("/apiKeys", apiKeys)

export { router as api }
