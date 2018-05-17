import * as Handlebars from "handlebars"
import * as fs from "fs"
import { promisify } from "util"
import { Build, Process } from "@iepaas/model"
import { Environment, getChildrenAdapter } from "@iepaas/db-adapter"
import { MachineType } from "@iepaas/machine-provider-abstract"
import { getMachineProvider } from "../getMachineProvider"
import { randomNumber } from "../misc/randomNumber"
import { randomString } from "../misc/randomString"
import { updateNginxConfig } from "../nginx/updateNginxConfig"
import { getInternalAddress } from "../network/getInternalAddress"

const readFile = promisify(fs.readFile)

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
        givenEnv,
		internalAddress
	] = await Promise.all([
		getMachineProvider(),
		getChildrenAdapter(true),
		Environment.getAll(),
		getInternalAddress()
	])

	const logPort = isJob ? 5002 : 5001

    const template = Handlebars.compile(
        await readFile("/iepaas/res/launchChild.hbs", "utf8")
    )

	const createMachine = async () => {
		// Randomize the ports so the authentication doesn't hardcode them
		// TODO jobs shouldn't have ports given to them
		// TODO make a health check port too
		const port = randomNumber(3001, 4000)
		const env = [
			...givenEnv,
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

		const scriptFile = `/tmp/iepaas_${randomString(6)}.sh`
		const logFile = `/tmp/iepaas_${randomString(6)}.log`

		const commands = template({
            logFile,
			logPort,
			scriptFile,
			env,
			command,
			internalAddress
        }).split("\n")

		const machine = await Provider.createMachine(
			MachineType.CHILD,
			commands,
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
