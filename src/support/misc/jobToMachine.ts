import { Child } from "@iepaas/model"
import { Machine } from "@iepaas/machine-provider-abstract"

export function childToMachine(child: Child): Machine {
	return {
		id: child.machineId,
		address: child.machineAddress
	}
}
