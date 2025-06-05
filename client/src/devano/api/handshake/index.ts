import axios from "axios";
import { sona, useHandshakeToken, useUserToken } from "~/devano/api/utils";
import { z } from "zod";

const HandshakeResponse = z.object({
	handshake_id: z.string(),
	user_id: z.string(),
});

export async function handshake() {
	try {
		const response = await sona.get("/hs");
		console.log({ response });
		const data = HandshakeResponse.parse(response.data);
		localStorage.setItem("hs", data.handshake_id);
		localStorage.setItem("ut", data.user_id);
		// this is also set `onMount` at the top level
		useHandshakeToken(() => localStorage.getItem("hs"));
		useUserToken(() => localStorage.getItem("ut"));
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return new Error(
				error.response?.data?.message || "An error occurred during login"
			);
		}
		return new Error("An unexpected error occurred");
	}
}
