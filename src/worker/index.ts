import { setupNginxControl } from "../support/nginx/setupNginxControl"
import { setupDomainValidations } from "./domains"

async function main() {
	await Promise.all([setupNginxControl()])
	await Promise.all([setupDomainValidations()])
}

main().catch(console.error)
