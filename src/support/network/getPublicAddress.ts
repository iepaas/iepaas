import { getDomainsAdapter } from "@iepaas/db-adapter"
import { getPublicIp } from "./getPublicIp"

/**
 * @returns An address where the iepaas parent can be reached publicly. If
 * a domain exists and is validated, this returns the domain. Otherwise, this
 * returns the public IP of the machine running the iepaas parent.
 */
export async function getPublicAddress(): Promise<string> {
	const domains = await getDomainsAdapter().then(A => A.findAllValidated())

	if (domains.length === 0) {
		return await getPublicIp()
	} else {
		return domains[0].name
	}
}
