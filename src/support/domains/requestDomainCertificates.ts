import { oneLine } from "common-tags"
import { Domain } from "@iepaas/model"
import { exec } from "../exec"

export async function requestDomainCertificates(domain: Domain) {
	// TODO make user put their email
	const { stdout, stderr, exitCode } = await exec(
		oneLine`
			sudo certbot certonly -n
				--webroot
				--agree-tos
				--email letsencrypt@iepaas.org
				-w /var/www/html
				-d ${domain.name}
		`
	)

	if (exitCode > 0) {
		throw new Error("Let's Encrypt cert request failed!\n" + stdout + stderr)
	}
}
