import * as Handlebars from "handlebars"
import * as fs from "fs"
import { MachineType } from "@iepaas/machine-provider-abstract"
import { Config, getBuildsAdapter } from "@iepaas/db-adapter"
import { promisify } from "util"
import { getMachineProvider } from "../getMachineProvider"
import { REPO_URL } from "../../configKeys"

const readFile = promisify(fs.readFile)

export async function createBuild(commit: string) {
	const [Provider, repoUrl] = await Promise.all([
		getMachineProvider(),
		Config.get(REPO_URL)
	])

	if (!repoUrl) {
		throw new Error("The repo URL is not defined")
	}

	const template = Handlebars.compile(
		await readFile("/iepaas/res/buildApp.hbs", "utf8")
	)

	const commands = template({
		// TODO allow to change
		nodeVersion: "8.9.4",
		repoUrl: await Config.get(REPO_URL),
		commit
	}).split("\n")

	const machine = await Provider.createMachine(MachineType.BUILD, commands)

	const snapshot = await Provider.takeSnapshot(machine)
	await Provider.destroyMachine(machine)

	const Builds = await getBuildsAdapter()
	return await Builds.insert({
		commit: commit,
		snapshot: snapshot.id
	})
}
