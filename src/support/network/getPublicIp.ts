import { exec } from "../exec"

export async function getPublicIp(): Promise<string> {
	const { exitCode, stdout, stderr } = await exec(
		"dig +short myip.opendns.com @resolver1.opendns.com"
	)

	if (exitCode === 0) {
		return stdout.trim()
	} else {
		throw new Error(stderr)
	}
}
