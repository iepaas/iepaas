import * as fs from "fs"
import { promisify } from "util"

const access = promisify(fs.access)

export async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path, fs.constants.R_OK)
		return true
	} catch (e) {
		if (e.code === "ENOENT") {
			return false
		} else {
			throw e
		}
	}
}
