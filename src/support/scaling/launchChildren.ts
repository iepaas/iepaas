import { oneLine } from "common-tags"
import { Build, Process } from "@iepaas/model"
import { Environment, getChildrenAdapter } from "@iepaas/db-adapter"
import { MachineType } from "@iepaas/machine-provider-abstract"
import { getMachineProvider } from "../getMachineProvider"
import { randomNumber } from "../misc/randomNumber"
import { randomString } from "../misc/randomString"
import { updateNginxConfig } from "../nginx/updateNginxConfig"
import { getInternalAddress } from "../network/getInternalAddress"

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

	console.log(
		`Launching children: ${JSON.stringify({ command, isJob, quantity })}`
	)

	const [
		Provider,
		Children,
		env,
		internalAddress
	] = await Promise.all([
		getMachineProvider(),
		getChildrenAdapter(true),
		Environment.getAll(),
		getInternalAddress()
	])

	const logPort = isJob ? 5002 : 5001

	const createMachine = async () => {
		// Randomize the ports so the authentication doesn't hardcode them
		// TODO jobs shouldn't have ports given to them
		// TODO make a health check port too
		const port = randomNumber(3001, 4000)
		const envCommands = [
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
		].map(it => `export ${it.key}='${it.value}'`)

		const scriptFile = `/tmp/iepaas_${randomString(6)}.sh`
		const logFile = `/tmp/iepaas_${randomString(6)}.log`

		const machine = await Provider.createMachine(
			MachineType.CHILD,
			// TODO move this to a template
			[
				`cd /app`,
				`touch ${logFile}`,
				`cat > ${scriptFile} << EOF`,
				...envCommands,
				command,
				// We sleep for a bit because the children will only be
				// authenticated if they have been created successfully,
				// and the creation finished after cloud-init finishes
				isJob
					? oneLine`sleep 5 &&
						curl https://${internalAddress}:4898/api/v1/jobs
						-X DELETE
						--insecure
						--header "X-Iepaas-Authenticate-As-Child: true"
						--retry 10
						--retry-delay 5
						> /dev/null 2>&1`
					: "",
				`EOF`,
				`nohup tail -f ${logFile} | nc ${internalAddress} ${logPort} &`,
				`nohup sh -c 'bash ${scriptFile} > ${logFile} 2>&1' &`,
				`wait $!`,
				// If the process exits, destory the machine to launch another
				oneLine`curl https://${internalAddress}:4898/api/v1/jobs
					-X DELETE
					--insecure
					--header "X-Iepaas-Authenticate-As-Child: true"
					--retry 10
					--retry-delay 5
					> /dev/null 2>&1`
				// TODO replace machine when process exits
			],
			{ id: build.snapshot }
		)

		return { machine, port }
	}

	// TODO save the machine before cloud init begins
	// This is because the child might try to authenticate before it being
	// present in the list of children
	await Promise.all(
		Array(quantity)
			.fill(null)
			.map(() =>
				createMachine().then(({ machine, port }) =>
					Children.insert({
						machineId: machine.id,
						machineAddress: machine.privateAddress,
						machinePort: port + "",
						isJob,
						build,
						...(() => {
							if (process) {
								return { process }
							} else {
								return { command: givenCommand }
							}
						})()
					})
				)
			)
	)

	await Children.commit()

	if (!isJob && process && process.name === "web") {
		await updateNginxConfig()
	}

	console.log("All children successfully launched!")
}
