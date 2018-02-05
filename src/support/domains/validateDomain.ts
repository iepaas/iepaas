import { oneLine } from "common-tags"
import { Domain } from "@iepaas/model"
import { getDomainsAdapter } from "@iepaas/db-adapter"
import { getPublicAddress } from "../getPublicAddress"
import { getAddressOfHost } from "../getAddressOfHost"
import { updateNginxConfig } from "../nginx/updateNginxConfig"
import { requestDomainCertificates } from "./requestDomainCertificates"

/**
 * Ensures that a Domain's A record is pointing to our public IP address.
 * If it is, it generates its certificates and adds it to the nginx config.
 * @param domain The domain we want to check
 */
export async function validateDomain(domain: Domain) {
	console.log(`Attempting validation for domain ${domain.name}`)

	const Domains = await getDomainsAdapter()

	const [ourAddress, domainAddress] = await Promise.all([
		getPublicAddress(),
		getAddressOfHost(domain.name)
	])

	if (ourAddress === domainAddress) {
		await requestDomainCertificates(domain)
		console.log("Certificates received successfully")

		await Domains.update(domain, { validated: true })
		await updateNginxConfig()

		console.log(`Validation for domain ${domain.name} successful`)
	} else {
		console.log(oneLine`Domain validation failed - our address:
		${ourAddress}, domain: ${domain.name}, domain address: ${domainAddress}`)
	}
}
