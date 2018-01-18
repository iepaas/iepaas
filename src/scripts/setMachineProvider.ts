import { Config } from "@iepaas/db-adapter"
import { MACHINE_PROVIDER } from "../configKeys"
import { exec } from "../support/exec"

export async function main() {
	const provider = process.argv[2]

	if (!provider) {
		throw new Error("You need to pass the provider as an argument")
	}

	const command = `npm install ${provider}`

	const { stdout, exitCode } = await exec(command)

	console.log(stdout)

	if (exitCode !== 0) {
		throw new Error(`${command} failed!`)
	}

	await Config.set(MACHINE_PROVIDER, provider)
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		console.log(err)
		process.exit(1)
	})
