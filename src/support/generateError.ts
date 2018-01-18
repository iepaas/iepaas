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
		case "IEPAAS_ALREADY_INITIALIZED":
			statusCode = 403
			additionalProperties.message =
				"The /init endpoint has already been called once, and cannot be called again."
			break
		case "REPO_INVALID":
			additionalProperties.message = oneLine`The repo you provided is
			doesn't exist, is currently unavailable, or is not public`
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
