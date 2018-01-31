import { Request, Response, NextFunction } from "express"
import { ApiRequest } from "../interfaces/ApiRequest"

type MiddlewareResponse = Array<number | object> | undefined

type Middleware = (req: ApiRequest) => Promise<MiddlewareResponse>

export function createMiddleware(predicate: Middleware) {
	return async function(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await predicate(req as ApiRequest)

			if (typeof response === "undefined") {
				next()
			} else {
				const [status, body] = response
				res.status(status as number).send(body as object)
			}
		} catch (e) {
			next(e)
		}
	}
}
