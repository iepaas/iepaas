import * as childProcess from "child_process"

export interface CommandResult {
	exitCode: number
	stdout: string
	stderr: string
}

export const exec = (command: string) =>
	new Promise<CommandResult>((resolve, reject) => {
		try {
			childProcess.exec(command, (err, stdout, stderr) => {
				resolve({
					exitCode: err ? (err as any).code : 0,
					stdout,
					stderr
				})
			})
		} catch (e) {
			reject(e)
		}
	})
