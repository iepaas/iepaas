import { Router } from "express"
import { methodNotAllowed } from "../../../support/methodNotAllowed"
import { selfDestructMachine } from "./selfDestructMachine"

const router = Router()

router
    .route("/")
    .post(selfDestructMachine)
    .all(methodNotAllowed)

export { router as internal }
