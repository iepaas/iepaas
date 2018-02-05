import { getDomainsAdapter } from "@iepaas/db-adapter"
import { createMiddleware } from "../../../support/createMiddleware"

export const queryDomain = createMiddleware(async req => {
	const Domains = await getDomainsAdapter()
	const domain = await Domains.findById(req.params.id)

	if (domain !== null) {
		req.queriedDomain = domain
	} else {
		return [404]
	}
})
