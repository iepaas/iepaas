import { createMiddleware } from "../../../support/createMiddleware"
import { getDomainsAdapter } from "@iepaas/db-adapter"

export const deleteDomain = createMiddleware(async req => {
	const Domains = await getDomainsAdapter()
	await Domains.delete(req.queriedDomain!)
	return [204]
})
