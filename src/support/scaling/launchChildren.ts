import { Build } from "@iepaas/model"
import { Environment, getChildrenAdapter } from "@iepaas/db-adapter"
import { MachineType } from "@iepaas/machine-provider-abstract"
import { getMachineProvider } from "../getMachineProvider"
import { randomNumber } from "../randomNumber"
import { updateNginxConfig } from "../nginx/updateNginxConfig"
import { getInternalAddress } from "../getInternalAddress"

export async function launchChildren(
	build: Build,
	command: string,
	quantity: number
) {
	const [Provider, Children, env, internalAddress] = await Promise.all([
		getMachineProvider(),
		getChildrenAdapter(true),
		Environment.getAll(),
		getInternalAddress()
	])

	const createMachine = async () => {
		// Randomize the ports so the authentication doesn't hardcode them
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
						isJob: false,
						build
					})
				)
			)
	)

	await Children.commit()
	await updateNginxConfig()
}
