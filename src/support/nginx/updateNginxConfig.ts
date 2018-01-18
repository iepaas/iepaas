import * as fs from "fs"
import { promisify } from "util"
import { exec } from "../exec"
import { renderNginxConfig } from "./template"
import { NGINX_IEPAAS_CONFIG_FILE } from "../../config"
import { getBuildsAdapter, getChildrenAdapter } from "@iepaas/db-adapter"

const writeFile = promisify(fs.writeFile)

export async function updateNginxConfig() {
	const [builds, children] = await Promise.all([
		getBuildsAdapter().then(A => A.findAll(1)),
		getChildrenAdapter()
			.then(A => A.findAll())
			// TODO don't filter here, make a findAllRunning method
			.then(it => it.filter(it => !it.isJob && !it.isTerminated))
	])

	const rendered = await renderNginxConfig({
		appBuilt: builds.length > 0,
		appRunning: children.length > 0,
		children
	})

	await writeFile(NGINX_IEPAAS_CONFIG_FILE, rendered, "utf8")

	const { exitCode, stderr } = await exec("systemctl restart nginx")

	if (exitCode !== 0) {
		throw new Error(
			`nginx restart failed. Exit code = ${exitCode}.\nStderr:\n${stderr}`
		)
	}
}
