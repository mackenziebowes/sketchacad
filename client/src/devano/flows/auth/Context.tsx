import { createContext, useContext, JSX, createSignal } from "solid-js";

import type { FormItemState } from "~/types/FormItem";

export enum AuthPages {
	Login = "login",
	ResetPassword = "request-reset",
	ProcessMagicLink = "read-magic-link",
	ConfirmNewPassword = "confirm-password-reset",
	Null = "null",
}

interface FormState {
	email: FormItemState<string>;
	password: FormItemState<string>;
	mlc: FormItemState<string>; // Magic Link Code
	view: FormItemState<AuthPages>;
	msg: FormItemState<string>;
	err: FormItemState<string>;
}

interface AuthContextVal {
	state: FormState;
}

export const AuthViewContext = createContext<AuthContextVal>();

export const useAuthView = () => {
	const context = useContext(AuthViewContext);
	if (!context) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
};

interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function AuthViewProvider(props: ProviderProps) {
	const [view, set_view] = createSignal<AuthPages>(AuthPages.Login);

	const [email, set_email] = createSignal<string>("");
	const [password, set_password] = createSignal<string>("");
	const [magicLinkCode, set_magicLinkCode] = createSignal<string>("");
	const [err, set_err] = createSignal<string>("");
	const [msg, set_msg] = createSignal<string>("");

	const state: FormState = {
		email: {
			get: email,
			set: set_email,
		},
		password: {
			get: password,
			set: set_password,
		},
		mlc: {
			get: magicLinkCode,
			set: set_magicLinkCode,
		},
		view: {
			get: view,
			set: set_view,
		},
		msg: {
			get: msg,
			set: set_msg,
		},
		err: {
			get: err,
			set: set_err,
		},
	};

	return (
		<AuthViewContext.Provider
			value={{
				state,
			}}
		>
			{props.children}
		</AuthViewContext.Provider>
	);
}
