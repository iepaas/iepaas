import { createController } from "../../../support/createController"

export const getDomain = createController(async req => {
	return [200, req.queriedDomain!.serialize()]
})
