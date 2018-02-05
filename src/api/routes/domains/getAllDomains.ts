import { createController } from "../../../support/createController"
import { getDomainsAdapter } from "@iepaas/db-adapter"

export const getAllDomains = createController(async () => {
	const Domains = await getDomainsAdapter()
	return [200, (await Domains.findAll()).map(it => it.serialize())]
})
