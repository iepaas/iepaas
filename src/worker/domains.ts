import { getDomainsAdapter } from "@iepaas/db-adapter"
import { DOMAIN_INTERVAL } from "../config"
import { validateDomain } from "../support/domains/validateDomain"
import { setNonOverlappingInterval } from "../support/setNonOverlappingInterval"

export function setupDomainValidations() {
	setNonOverlappingInterval(async () => {
		try {
			const Domains = await getDomainsAdapter()
			await Domains.findAllPendingValidation().then(domains =>
				Promise.all(domains.map(validateDomain))
			)
		} catch (e) {
			console.error("Error when processing domain validations:")
			console.error(e)
		}
	}, DOMAIN_INTERVAL * 1000)
}
