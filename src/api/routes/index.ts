import { Router } from "express"
import { json as jsonParser } from "body-parser"
import { init } from "./init"

const router = Router()

router.use(jsonParser())

router.use("/init", init)

// router.use(authenticate)

export { router as api }
