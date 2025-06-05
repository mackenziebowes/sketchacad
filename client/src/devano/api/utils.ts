/**
 * Utility module for API interactions using Axios.
 *
 * This module provides two Axios instances, `sona` and `vona`, for handling API requests
 * with different levels of authorization. It also includes mechanisms for dynamically
 * injecting user and handshake tokens into requests made with the `vona` instance.
 *
 * ### Exports:
 *
 * - `BASE_URL`: The base URL for API requests, derived from environment variables.
 * - `sona`: An Axios instance for public API access, configured with cookies.
 * - `vona`: An Axios instance for authenticated API access, configured with cookies and
 *   optional Authorization and handshake tokens.
 * - `useUserToken(fn: () => MaybeString)`: A function to set the user token retrieval mechanism
 *   for the `vona` instance.
 * - `useHandshakeToken(fn: () => MaybeString)`: A function to set the handshake token retrieval mechanism
 *   for the `vona` instance.
 *
 * ### Axios Instances:
 *
 * - **`sona`**:
 *   - Represents a "stranger" or public access level.
 *   - Does not include Authorization headers.
 *   - Uses cookies for session management.
 *   - Includes a rate-limiting mechanism to prevent excessive requests.
 *
 * - **`vona`**:
 *   - Represents a "trusted" or authenticated access level.
 *   - Dynamically includes an Authorization header with a Bearer token if provided.
 *   - Dynamically includes a handshake token in the `ui-access-key` header if provided.
 *   - Uses cookies for session management.
 *
 * ### Functions:
 *
 * - **`useUserToken(fn: () => MaybeString)`**:
 *   - Sets a callback function to retrieve the user authentication token.
 *   - The token is dynamically injected into the Authorization header of requests made
 *     with the `vona` instance.
 *
 * - **`useHandshakeToken(fn: () => MaybeString)`**:
 *   - Sets a callback function to retrieve the handshake token.
 *   - The token is dynamically injected into the `ui-access-key` header of requests made
 *     with the `vona` instance.
 *
 * ### Interceptors:
 *
 * - The `sona` instance includes a request interceptor that:
 *   - Enforces a minimum time interval (5 seconds) between consecutive requests.
 *   - Rejects requests made too frequently with an appropriate error message.
 *
 * - The `vona` instance includes a request interceptor that:
 *   - Retrieves the user and handshake tokens using the callback functions set by
 *     `useUserToken` and `useHandshakeToken`.
 *   - Appends the tokens as headers (`Authorization` and `ui-access-key`) if available.
 */

import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * "Sona" is a Diralevan (conlang) reconstruction of PIE "sen-"" which,
 * in English, has descended into "senior" and "senate" - it means "outsider" in a neutral way.
 * This value, `sona`, is a plain axios instance for handling API calls without passing
 * any kind of tokens beyond standard cookies.
 */
export const sona = axios.create({
	// sona = stranger, public access
	baseURL: `${BASE_URL}/sona/`,
	withCredentials: true,
});

/**
 * "Vona" is a Diralevan (conlang) reconstruction of PIE 'wen-' which,
 * in English, has descended into "friend".
 * This value, `vona`, is an axios instance that appends a user-level token
 * for Authorization and a session level token for managing requests.
 */
export const vona = axios.create({
	// vona = trusted / known... bit of wishful thinking to trust a client you know
	baseURL: `${BASE_URL}/vona/`,
	withCredentials: true,
});

type MaybeString = string | undefined | null;

let getUserToken: (() => MaybeString) | null = null;
let getHandshakeToken: (() => MaybeString) | null = null;

export function useUserToken(fn: () => MaybeString) {
	getUserToken = fn;
}
export function useHandshakeToken(fn: () => MaybeString) {
	getHandshakeToken = fn;
}

let lastSonaRequest: Date | null = null;

export function userToken() {
	return getUserToken?.();
}
export function handshakeToken() {
	return getHandshakeToken?.();
}

sona.interceptors.request.use((config) => {
	const now = new Date();
	if (lastSonaRequest) {
		// Calculate the time difference in milliseconds
		const timeSinceLastRequest = now.getTime() - lastSonaRequest.getTime();

		// If the time difference is less than 5 seconds (5000 ms), reject the request
		// yet another magic number, fml
		if (timeSinceLastRequest < 5000) {
			return Promise.reject({
				message: "Too many requests. Please wait before trying again.",
			});
		}
	}
	lastSonaRequest = now;
	return config;
});

vona.interceptors.request.use((config) => {
	const userToken = getUserToken?.();
	const handshakeToken = getHandshakeToken?.();
	if (userToken) {
		config.headers.Authorization = `Bearer ${encodeURI(userToken)}`;
	}
	if (handshakeToken) {
		config.headers["ui-access-key"] = `Bearer ${encodeURI(handshakeToken)}`;
	}
	return config;
});
