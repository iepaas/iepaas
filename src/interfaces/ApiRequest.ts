import { Request } from "express"
import { ApiKey, Child, Domain } from "@iepaas/model"

export interface ApiRequest extends Request {
	authentication: ApiKey | Child
	queriedDomain?: Domain
}
