import { setNonOverlappingInterval } from "../support/setNonOverlappingInterval"
import { SCALING_INTERVAL } from "../config"
import { ensureCorrectProcessQuantities } from "../support/scaling/ensureCorrectProcessQuantities"

export function setupScalingControl() {
	setNonOverlappingInterval(async () => {
		try {
			await ensureCorrectProcessQuantities()
		} catch (e) {
			console.error("Error when processing scaling operations:")
			console.error(e)
		}
	}, SCALING_INTERVAL * 1000)
}
