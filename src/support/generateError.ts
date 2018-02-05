import { oneLine } from "common-tags"

export function generateError(errorCode: string, info?: any) {
	let statusCode = 400
	const additionalProperties = {} as any

	switch (errorCode) {
		case "API_KEY_NOT_PRESENT":
			statusCode = 401
			additionalProperties.message =
				"In order to make requests to the API the X-Iepaas-Api-Key header must be set"
			break
		case "API_KEY_INVALID":
			statusCode = 401
			additionalProperties.message =
				"The API key you provided is not valid or has been revoked"
			break
		case "CHILD_AUTHENTICATION_FAILED":
			const { ip } = info
			statusCode = 401
			additionalProperties.message = oneLine`The X-Iepaas-Authenticate-As-Child header is present,
				and iepaas has tried to authenticate your request using child
				authentication. However, the address ${ip} doesn't belong to
				an active (not terminated) child.`
			additionalProperties.originAddress = ip
			break
		case "APP_NOT_BUILT":
			statusCode = 422
			additionalProperties.message = oneLine`The requested operation is
			only available when the first build of the app has been created.`
			break
		case "INVALID_JSON":
			additionalProperties.message =
				"The body of your request is not valid JSON."
			break
		case "VALIDATION_ERROR":
			additionalProperties.message =
				"The body of your request didn't pass the server-side validation. Please refer " +
				"to the documentation."
			additionalProperties.conflictingParameters = info.array()
			break
	}
	return [
		statusCode,
		{
			error: {
				code: errorCode,
				...additionalProperties
			}
		}
	]
}
