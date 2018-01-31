import { createController } from "./createController"

export const methodNotAllowed = createController(async () => [405])
