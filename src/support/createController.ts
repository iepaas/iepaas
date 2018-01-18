import { Request, Response, NextFunction } from "express"
import { ApiRequest } from "../interfaces/ApiRequest"

type ControllerResponse = Array<number | object>

type Controller = (req: ApiRequest) => Promise<ControllerResponse>

export function createController(predicate: Controller) {
	return async function(req: Request, res: Response, next: NextFunction) {
		try {
			const [status, body] = await predicate(req as ApiRequest)
			res.status(status as number).send(body as object)
		} catch (e) {
			next(e)
		}
	}
}
