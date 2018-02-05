import { Build, Process } from "@iepaas/model"
import { Environment, getChildrenAdapter } from "@iepaas/db-adapter"
import { MachineType } from "@iepaas/machine-provider-abstract"
import { getMachineProvider } from "../getMachineProvider"
import { randomNumber } from "../randomNumber"
import { updateNginxConfig } from "../nginx/updateNginxConfig"
import { getInternalAddress } from "../getInternalAddress"

export interface LaunchChildrenOptions {
	build: Build
	process?: Process
	command?: string
	quantity: number
	isJob: boolean
}

export async function launchChildren(options: LaunchChildrenOptions) {
	const { build, process, command: givenCommand, quantity, isJob } = options

	const command = process ? process.command : givenCommand

	if (!command) {
		throw new Error("You need to define either the command or the build!")
	}

	const [Provider, Children, env, internalAddress] = await Promise.all([
		getMachineProvider(),
		getChildrenAdapter(true),
		Environment.getAll(),
		getInternalAddress()
	])

	const createMachine = async () => {
		// Randomize the ports so the authentication doesn't hardcode them
		// TODO jobs shouldn't have ports given to them
		// TODO make a health check port too
		const port = randomNumber(3001, 4000)
		const envString = [
			...env,
			{
				key: "PORT",
				value: port
			},
			{
				key: "IEPAAS",
				value: "true"
			},
			{
				key: "IEPAAS_API_HOST",
				value: internalAddress
			}
		]
			.map(it => `${it.key}=${it.value}`)
			.join(" ")

		const machine = await Provider.createMachine(
			MachineType.CHILD,
			[
				`cd /app`,
				`touch iepaas_app.log`,
				`nohup tail -f iepaas_app.log | nc ${internalAddress} 5001 &`,
				`${envString} nohup ${command} < /dev/null > iepaas_app.log 2>&1 &`
			],
			{ id: build.snapshot }
		)

		return { machine, port }
	}

	await Promise.all(
		Array(quantity)
			.fill(null)
			.map(() =>
				createMachine().then(({ machine, port }) =>
					Children.insert({
						command,
						machineAddress: machine.address,
						machinePort: port + "",
						isJob,
						build
					})
				)
			)
	)

	await Children.commit()

	if (!isJob) {
		await updateNginxConfig()
	}
}
