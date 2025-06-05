import Stack from "~/devano/atoms/layout/Stack";
import { Card } from "~/devano/atoms/layout/Card";
import { Heading } from "~/devano/atoms/layout/Heading";
import { TextInput } from "~/devano/atoms/inputs/TextInput";
import { Button } from "~/devano/atoms/buttons/Button";
import { ErrorMessage } from "~/devano/atoms/feedback/ErrorMessage";
import { useOnboarding } from "../Context";
import { createSignal, onMount, Show } from "solid-js";
import { onboarding } from "../api";
export default function ConfirmEmail() {
	const { state, goToNextStep } = useOnboarding();
	const [shouldShowResend, set_shouldshouldShowResend] =
		createSignal<boolean>(false);
	const shouldShowResendMemo = () => shouldShowResend() === true;
	const [codeValid, set_codeValid] = createSignal<boolean | undefined>(
		undefined
	);
	const [countdown, setCountdown] = createSignal<number>(10);

	onMount(() => {
		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					set_shouldshouldShowResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	});

	async function resendConfirmationEmail() {
		//todo;
		const res = await onboarding.resendConfirmationEmail(state.email.get());
		if (!res.ok) {
			state.err.set(res.err);
		}
	}
	async function confirmEmail() {
		const res = await onboarding.confirmEmail(
			state.email_confirmation.get(),
			state.email.get()
		);
		if (res.ok) {
			state.confirmed.set(true);
			goToNextStep();
		} else {
			state.err.set(res.err);
		}
	}
	return (
		<Stack direction="col">
			<Card>
				<Heading as="h2">Check your email!</Heading>
				<p>Check {state.email.get()} for a code from us and enter it here.</p>
				<TextInput
					label="Your Code"
					get={state.email_confirmation.get}
					set={state.email_confirmation.set}
				/>
				<ErrorMessage when={codeValid() === false}>
					<p>Hmm :/ Your code doesn't match our records.</p>
					<Button onclick={resendConfirmationEmail}>Resend Email</Button>
				</ErrorMessage>
				<p>
					If you haven't recieved your message yet, you can resend in:{" "}
					{countdown()} seconds.
				</p>
				<Show when={shouldShowResendMemo()}>
					<Button onclick={resendConfirmationEmail}>Resend Email</Button>
				</Show>
				<Button onClick={confirmEmail}>Next</Button>
			</Card>
		</Stack>
	);
}
