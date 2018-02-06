import { exec } from "../exec"

export async function getAddressOfHost(host: string): Promise<string | null> {
	const { exitCode, stdout } = await exec(`dig +short ${host}`)

	if (exitCode === 0 && stdout !== "") {
		return stdout.trim()
	} else {
		return null
	}
}
