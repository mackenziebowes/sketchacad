import { Button } from "~/devano/atoms/buttons/Button";
import { PasswordInput } from "~/devano/atoms/inputs/PasswordInput";
import { AuthPages, useAuthView } from "../Context";
import AuthCard from "../components/AuthCard";
import { auth } from "../api";
import { createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

export default function UpdatePassword() {
	const { state } = useAuthView();
	const [cp, set_cp] = createSignal("");
	const valid = () => {
		return cp() === state.password.get() && cp().length > 8;
	};
	async function handleConfirmReset() {
		const password = state.password.get();
		const confirmPassword = cp();
		const { key } = useParams();
		if (password !== confirmPassword) {
			state.err.set("Passwords must match");
		}
		const res = await auth.confirmReset(password, key);
		if (res.ok) {
			state.view.set(AuthPages.Null);
		} else {
			state.err.set(res.err);
		}
	}
	return (
		<AuthCard title="Reset Password">
			<PasswordInput
				label="New Password"
				get={state.password.get}
				set={state.password.set}
			/>
			<PasswordInput
				label="Confirm New Password"
				get={cp}
				set={set_cp}
			/>
			<Button
				onclick={handleConfirmReset}
				disabled={!valid()}
			>
				Update Password
			</Button>
		</AuthCard>
	);
}
