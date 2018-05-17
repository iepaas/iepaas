import { ApiKey, Child } from "@iepaas/model"
import { getChildrenAdapter } from "@iepaas/db-adapter"
import { createController } from "../../../support/createController"
import { getMachineProvider } from "../../../support/getMachineProvider"
import { childToMachine } from "../../../support/misc/childToMachine"
import {updateNginxConfig} from "../../../support/nginx/updateNginxConfig";

export const selfDestructMachine = createController(async req => {
	if (req.authentication instanceof ApiKey) {
		return [
			403,
			{
				error: "NOT_A_CHILD",
				message: "Only children are allowed to call this endpoint"
			}
		]
	}

	const child: Child = req.authentication

	const Provider = await getMachineProvider()

    getChildrenAdapter()
		.then(A => A.update(child, { isTerminated: true }))
		.then(() => {
			if (child.isJob) {
				return Promise.resolve()
			} else {
				// Replace the machine that exited
				return updateNginxConfig()
			}
		})
		.then(() =>
			Provider.destroyMachine(childToMachine(child))
		)
        .catch(err => {
            console.error("Failed to terminate a machine!")
            console.error(err)
        })

	if (child.isJob) {
        console.log(`The job from machine ${child.machineId} finished`)
	} else {
        console.log(`Machine ${child.machineId} quit unexpectedly!`)
	}

	return [202]
})
