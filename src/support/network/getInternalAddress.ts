import { exec } from "../exec"

export async function getInternalAddress(): Promise<string> {
	const { exitCode, stdout, stderr } = await exec(
		"ip route get 8.8.8.8 | awk '{print $NF; exit}'"
	)

	if (exitCode === 0) {
		return stdout.trim()
	} else {
		throw new Error(stderr)
	}
}
