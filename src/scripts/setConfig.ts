import { Config } from "@iepaas/db-adapter"

export async function main() {
	const [, , key, value] = process.argv

	if (!key || !value) {
		throw new Error("Usage: npm run set-config key value")
	}

	await Config.set(key, value)
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		console.log(err)
		process.exit(1)
	})
