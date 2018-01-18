import { setupNginxControl } from "../support/nginx"

async function main() {
	await Promise.all([setupNginxControl()])

	// Keep process alive - eventually should be removed
	setInterval(() => {}, 60000)
}

main().catch(console.error)
