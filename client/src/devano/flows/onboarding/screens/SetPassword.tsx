import Stack from "~/devano/atoms/layout/Stack";
import { Card } from "~/devano/atoms/layout/Card";
import { Heading } from "~/devano/atoms/layout/Heading";
import { Button } from "~/devano/atoms/buttons/Button";
import { ErrorMessage } from "~/devano/atoms/feedback/ErrorMessage";
import { WarningMessage } from "~/devano/atoms/feedback/WarningMessage";
import { useOnboarding } from "../Context";
import { createSignal, createEffect } from "solid-js";
import { PasswordInput } from "~/devano/atoms/inputs/PasswordInput";
import { onboarding } from "../api";

export default function SetPassword() {
	const { state, goToNextStep } = useOnboarding();
	const [confirmedPassword, set_confirmedPassword] = createSignal<string>("");
	const [warn, set_warn] = createSignal<string>("");
	const valid = () => {
		let p = state.password.get();
		let pl = p.length;
		let c = confirmedPassword();
		if (p === c && pl > 8) return true;
	};
	createEffect(() => {
		let p = state.password.get();
		let pl = p.length;
		let c = confirmedPassword();
		let cl = c.length;
		let debounceTimeout: NodeJS.Timeout | undefined = undefined;
		if (pl > 0 && cl > 0 && pl < 8 && cl < 8) {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => {
				set_warn("Password is short - aim for at least 8 characters.");
				setTimeout(() => {
					set_warn("");
				}, 1500);
			}, 30000);
		}
		if (p === c && pl > 8) {
			// all good
		} else {
			state.err.set(
				"Passwords don't match. There's a visibilty toggle inside the password input, double check!"
			);
			setTimeout(() => {
				state.err.set("");
			}, 1500);
		}
	});
	async function savePassword() {
		if (!valid()) return;
		const res = await onboarding.setPassword(state.password.get());
		if (res.ok) {
			goToNextStep();
		} else {
			state.err.set(res.err);
		}
	}
	return (
		<Stack direction="col">
			<Card>
				<Heading as="h2">Add a Password</Heading>
				<p>
					This step is <strong>optional.</strong>
				</p>
				<PasswordInput
					label="Choose a password"
					get={state.email_confirmation.get}
					set={state.email_confirmation.set}
				/>
				<PasswordInput
					label="Confirm password"
					get={confirmedPassword}
					set={set_confirmedPassword}
				/>
				<ErrorMessage when={state.err.get().length > 0}>
					<p>{state.err.get()}</p>
				</ErrorMessage>
				<WarningMessage when={warn().length > 0}>
					<p>{warn()}</p>
				</WarningMessage>
				<Stack direction="row">
					<Button
						onClick={savePassword}
						disabled={!valid()}
					>
						Save
					</Button>
					<Button
						onClick={goToNextStep}
						outline
					>
						Skip
					</Button>
				</Stack>
			</Card>
		</Stack>
	);
}
