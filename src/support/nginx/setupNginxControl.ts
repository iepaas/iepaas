import { oneLine } from "common-tags"
import { initializeNginxConfig } from "./initializeNginxConfig"
import { fileExists } from "../fileExists"
import { NGINX_IEPAAS_CONFIG_FILE } from "../../config"
import { runningAsSuperuser } from "../runningAsSuperuser"
import { updateNginxConfig } from "./updateNginxConfig"

export async function setupNginxControl() {
	if (!await runningAsSuperuser()) {
		console.error("The worker process must be ran as superuser!")
		process.exit(1)
	}

	if (!await fileExists(NGINX_IEPAAS_CONFIG_FILE)) {
		console.log(oneLine`
		File ${NGINX_IEPAAS_CONFIG_FILE} does not exist.
		Initializing NGINX config...`)
		await initializeNginxConfig()
	}

	await updateNginxConfig()
}
