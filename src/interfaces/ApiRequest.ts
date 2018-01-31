import { Request } from "express"
import { ApiKey, Child } from "@iepaas/model"

export interface ApiRequest extends Request {
	authentication: ApiKey | Child
}
