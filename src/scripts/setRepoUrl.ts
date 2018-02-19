import * as Git from "nodegit"
import { Config, getProcessesAdapter } from "@iepaas/db-adapter"
import { REPO_URL } from "../configKeys"
import { createBuild } from "../support/builds/createBuild"
import { ensureCorrectProcessQuantities } from "../support/scaling/ensureCorrectProcessQuantities"

export async function main() {
	const repoUrl = process.argv[2]

	if (!repoUrl) {
		throw new Error("You need to pass the repo URL as an argument")
	}

	try {
		await Config.set(REPO_URL, repoUrl)

		const repo = await Git.Clone.clone(repoUrl, "/app")
		console.log("Repository cloned successfully in /app")

		const commit = (await repo.getHeadCommit()).sha()
		console.log(`Building commit ${commit}...`)

		const build = await createBuild(commit)
		console.log(`Build #${build.id} succeeded. Launching the first child...`)

		// TODO support buildpacks and detect it automatically
		await getProcessesAdapter().then(A =>
			A.insert({
				name: "web",
				command: "npm start",
				targetQuantity: 1
			})
		)

		await ensureCorrectProcessQuantities()

		console.log("Launch succeeded; the first child is live.")
	} catch (e) {
		await Config.delete(REPO_URL)
		throw e
	}
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		console.log(err)
		process.exit(1)
	})
