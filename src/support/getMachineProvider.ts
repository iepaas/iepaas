import { AbstractMachineProvider } from "@iepaas/machine-provider-abstract"
import { Config } from "@iepaas/db-adapter"
import { MACHINE_PROVIDER } from "../configKeys"

export async function getMachineProvider() {
	const providerName = await Config.get(MACHINE_PROVIDER)

	if (!providerName) {
		throw new Error(
			"The machine provider is not configured! " +
				"Run 'npm run set-machine-provider provider-name'"
		)
	}

	const pkg = require(providerName)
	const Provider = pkg.MachineProvider

	// TODO allow to change app name
	return new Provider("testapp", Config) as AbstractMachineProvider
}
