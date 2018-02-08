import { setupNginxControl } from "../support/nginx/setupNginxControl"
import { setupDomainValidations } from "./domains"
import { setupScalingControl } from "./scaling"

async function main() {
	await Promise.all([setupNginxControl()])
	await Promise.all([setupDomainValidations(), setupScalingControl()])
}

main().catch(console.error)
