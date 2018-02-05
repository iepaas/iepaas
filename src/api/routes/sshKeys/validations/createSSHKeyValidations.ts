import { body } from "express-validator/check"

export const createSSHKeyValidations = [body("key").isLength({ min: 1 })]
