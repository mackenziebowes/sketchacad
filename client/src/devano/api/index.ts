
import { handshake } from "./handshake";
import { useUserToken, useHandshakeToken } from "./utils";

export const api = {
	handshake,
	tokens: {
		user: useUserToken,
		handshake: useHandshakeToken,
	},
};
