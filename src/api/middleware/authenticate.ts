import { getApiKeysAdapter, getChildrenAdapter } from "@iepaas/db-adapter"
import { generateError } from "../../support/generateError"
import { createMiddleware } from "../../support/createMiddleware"
import { ApiRequest } from "../../interfaces/ApiRequest"

export const authenticate = createMiddleware(async req => {
	if (
		(req.get("X-Iepaas-Authenticate-As-Child") || "").toLowerCase() !== "true"
	) {
		return authenticateAsUser(req)
	} else {
		return authenticateAsChild(req)
	}
})

async function authenticateAsUser(req: ApiRequest) {
	const ApiKeys = await getApiKeysAdapter()
	const plainTextKey = req.get("X-Iepaas-Api-Key")

	if (plainTextKey) {
		const key = await ApiKeys.findByPlainTextKey(plainTextKey)

		if (key) {
			req.authentication = key
			ApiKeys.update(key, { lastUsed: new Date() }).catch((err: any) => {
				console.error(
					`Error when updating the lastUsed property of apiKey ${key.fragment}`
				)
				console.error(err)
			})
		} else {
			return generateError("API_KEY_INVALID")
		}
	} else {
		// If the endpoint is POST /apiKeys we allow unauthenticated requests
		// as longs as there are no api keys created yet, so that the admin
		// key can be created after the server is built.
		const isRequestToCreateFirstApiKey =
			req.originalUrl === "/api/v1/apiKeys" &&
			req.method === "POST" &&
			(await ApiKeys.findAll()).length === 0

		if (!isRequestToCreateFirstApiKey) {
			return generateError("API_KEY_NOT_PRESENT")
		}
	}
}

export async function authenticateAsChild(req: ApiRequest) {
	const Children = await getChildrenAdapter()
	const ip = req.connection.remoteAddress || ""
	const child = await Children.findActiveByAddress(ip)

	if (child) {
		req.authentication = child
	} else {
		return generateError("CHILD_AUTHENTICATION_FAILED", { ip })
	}
}
