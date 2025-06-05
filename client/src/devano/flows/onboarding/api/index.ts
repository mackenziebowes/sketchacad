import { sona, vona, useUserToken } from "~/devano/api/utils";
import type { GeneralApiResponse, JWTResponse } from "~/types/API";
// sona = unknown, vona = known

export const onboarding = {
	submitEmail,
	resendConfirmationEmail,
	confirmEmail,
	setPassword,
	setUsername,
	agreeToTerms,
};

async function submitEmail(email: string) {
	// we kinda make up whatever here.
	// write an API we want to consume, yk?
	const response = await sona.post("/auth/submit-email", {
		email,
	});
	return response.data as GeneralApiResponse;
}

async function confirmEmail(code: string, email: string) {
	const response = await sona.post("/auth/confirm-email", {
		email,
		code,
	});
	const data = response.data as JWTResponse;
	if (data.ok) {
		localStorage.setItem("ut", data.token); // apply the JWT cos we're switching to restricted routes now
		useUserToken(() => localStorage.getItem("ut"));
	}
	return data;
}

async function resendConfirmationEmail(email: string) {
	// actually, yes email
	const response = await sona.post("/auth/resend-email", {
		email,
	});
	return response.data as GeneralApiResponse;
}

async function setPassword(password: string) {
	const response = await vona.post("/user/set-password", {
		password,
	});
	return response.data as GeneralApiResponse;
}

async function setUsername(username: string) {
	const response = await vona.post("/user/set-username", {
		username,
	});
	return response.data as GeneralApiResponse;
}

async function agreeToTerms() {
	// no args bc... yea, are you going to not agree?
	const response = await vona.get("/user/agree-to-terms");
	return response.data as GeneralApiResponse;
}
