import { randomBytes } from "crypto"

export function randomString(length: number): string {
	return randomBytes(Math.ceil(length / 2)).toString("hex")
}
