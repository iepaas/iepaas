import { getBuildsAdapter } from "@iepaas/db-adapter"
import { Build } from "@iepaas/model"

// TODO do this at the database level
export async function getLatestBuild(): Promise<Build | null> {
	const Builds = await getBuildsAdapter()
	const builds = (await Builds.findAll()).sort((a, b) => b.id - a.id)

	return builds[0] || null
}
