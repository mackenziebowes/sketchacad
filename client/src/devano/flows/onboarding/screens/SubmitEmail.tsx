import Stack from "~/devano/atoms/layout/Stack";
import { Card } from "~/devano/atoms/layout/Card";
import { Heading } from "~/devano/atoms/layout/Heading";
import { TextInput } from "~/devano/atoms/inputs/TextInput";
import { Button } from "~/devano/atoms/buttons/Button";
import { ErrorMessage } from "~/devano/atoms/feedback/ErrorMessage";
import { useOnboarding } from "../Context";
import { onboarding } from "../api";
import { createSignal } from "solid-js";
import { z } from "zod";

const emailSchema = z.object({
	email: z.string().email(),
});

export default function SubmitEmail() {
	const { state, goToNextStep } = useOnboarding();
	const errLM = () => state.err.get().length > 0;
	const valid = () => {
		const email = state.email.get();
		try {
			emailSchema.parse({ email });
			return true;
		} catch (error) {
			return false;
		}
	};
	async function saveEmail() {
		if (!valid()) return;
		const res = await onboarding.submitEmail(state.email.get());
		if (res.ok) {
			goToNextStep();
		} else {
			state.err.set(res.err);
		}
	}
	return (
		<Stack direction="col">
			<Card>
				<Heading as="h2">Enter Email</Heading>
				<p>Enter your email to get started.</p>
				<TextInput
					label="Your Email"
					get={state.email.get}
					set={state.email.set}
					validationSchema={emailSchema}
					onError={state.err.set}
				/>
				<ErrorMessage when={errLM()}>{state.err.get()}</ErrorMessage>
				<Button
					onClick={saveEmail}
					disabled={valid()}
				>
					Next
				</Button>
			</Card>
		</Stack>
	);
}
