import * as Handlebars from "handlebars"
import * as fs from "fs"
import { promisify } from "util"
import { Child } from "@iepaas/model"

const readFile = promisify(fs.readFile)

export interface NginxConfigData {
	appBuilt: boolean
	appRunning: boolean
	children: Array<Child>
}

let _template: HandlebarsTemplateDelegate<NginxConfigData> | null = null

export async function renderNginxConfig(
	data: NginxConfigData
): Promise<string> {
	const template = await (async () => {
		if (!_template) {
			_template = Handlebars.compile(
				await readFile("/iepaas/res/nginxTemplate.hbs", "utf8")
			)
		}
		return _template
	})()

	return template(data)
}
