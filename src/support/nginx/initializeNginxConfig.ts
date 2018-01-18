import * as fs from "fs"
import { promisify } from "util"
import { NGINX_ENABLED_DIR, NGINX_IEPAAS_CONFIG_FILE } from "../../config"

const writeFile = promisify(fs.writeFile)
const symlink = promisify(fs.symlink)
const unlink = promisify(fs.unlink)

/**
 * This function is called the first time that iepaas is set up, so that the
 * NGINX configuration file can be created.
 */
export async function initializeNginxConfig() {
	// Write gibberish to the config file so we can create the links
	await writeFile(NGINX_IEPAAS_CONFIG_FILE, "...")

	// Create the links
	await unlink(`${NGINX_ENABLED_DIR}/default`)
	await symlink(NGINX_IEPAAS_CONFIG_FILE, `${NGINX_ENABLED_DIR}/iepaas`)

	// Then the function setupNginxControl will take care of writing
	// the config file and restarting nginx
}
