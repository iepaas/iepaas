import * as fs from "fs"
import { promisify } from "util"
import { NGINX_AVAILABLE_DIR } from "../config"

const access = promisify(fs.access)

export async function runningAsSuperuser(): Promise<boolean> {
	try {
		await access(NGINX_AVAILABLE_DIR, fs.constants.W_OK)
		return true
	} catch (e) {
		if (e.code === "EACCES") {
			return false
		} else {
			throw e
		}
	}
}
