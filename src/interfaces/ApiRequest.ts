import { Request } from "express"
import { ApiKey } from "@iepaas/model"

export interface ApiRequest extends Request {
	apiKey: ApiKey
}
