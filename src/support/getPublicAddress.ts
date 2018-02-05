import { exec } from "./exec"

export async function getPublicAddress(): Promise<string> {
	// TODO when we support domains and let's encrypt this should return
	// the configured domain
	const { exitCode, stdout, stderr } = await exec(
		"dig +short myip.opendns.com @resolver1.opendns.com"
	)

	if (exitCode === 0) {
		return stdout.trim()
	} else {
		throw new Error(stderr)
	}
}
