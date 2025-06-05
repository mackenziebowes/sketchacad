import { sona, vona, useUserToken } from "~/devano/api/utils";
import type { GeneralApiResponse, JWTResponse } from "~/types/API";

export const auth = {
	login: LogIn,
	requestReset: RequestReset,
	confirmReset: ConfirmReset,
	requestMagicLink,
	confirmMagicLink,
};

interface LogInArgs {
	email: string;
	password: string;
}

async function LogIn(args: LogInArgs): Promise<JWTResponse> {
	const { email, password } = args;
	const res = await sona.post("/auth/log-in", {
		email,
		password,
	});
	const data = res.data as JWTResponse;
	if (data.ok) {
		localStorage.setItem("ut", data.token); // apply the JWT cos we're switching to restricted routes now
		useUserToken(() => localStorage.getItem("ut"));
	}
	return data;
}

async function RequestReset(email: string): Promise<GeneralApiResponse> {
	const res = await sona.post("/auth/request-reset", {
		email,
	});
	const data = res.data as GeneralApiResponse;
	return data;
}

async function ConfirmReset(
	password: string,
	key: string
): Promise<JWTResponse> {
	const res = await sona.post(`/auth/reset-password/${key}`, {
		password,
	});
	const data = res.data as JWTResponse;
	if (data.ok) {
		localStorage.setItem("ut", data.token); // apply the JWT cos we're switching to restricted routes now
		useUserToken(() => localStorage.getItem("ut"));
	}
	return data;
}

async function requestMagicLink(email: string): Promise<GeneralApiResponse> {
	const res = await sona.post(`/auth/magic-link`, {
		email,
	});
	const data = res.data as JWTResponse;
	if (data.ok) {
		localStorage.setItem("ut", data.token); // apply the JWT cos we're switching to restricted routes now
		useUserToken(() => localStorage.getItem("ut"));
	}
	return data;
}

async function confirmMagicLink(mlc: string): Promise<JWTResponse> {
	const res = await sona.get(`/auth/magic-link/${mlc}`);
	const data = res.data as JWTResponse;
	if (data.ok) {
		localStorage.setItem("ut", data.token); // apply the JWT cos we're switching to restricted routes now
		useUserToken(() => localStorage.getItem("ut"));
	}
	return data;
}
