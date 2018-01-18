import { Router } from "express"
import { json as jsonParser } from "body-parser"
import { initializeIepaas } from "./init/initializeIepaas"

const router = Router()

router.use(jsonParser())

router.use("/init", initializeIepaas)

// router.use(authenticate)

export { router as api }
