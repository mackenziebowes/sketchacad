import Stack from "~/devano/atoms/layout/Stack";
import { Card } from "~/devano/atoms/layout/Card";
import { Heading } from "~/devano/atoms/layout/Heading";
import { TextInput } from "~/devano/atoms/inputs/TextInput";
import { Button } from "~/devano/atoms/buttons/Button";
import { ErrorMessage } from "~/devano/atoms/feedback/ErrorMessage";
import { useOnboarding } from "../Context";
import { onboarding } from "../api";
import { z } from "zod";

const usernameSchema = z.object({
	username: z
		.string()
		.min(4)
		.regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
});

export default function SubmitUsername() {
	const { state, goToNextStep } = useOnboarding();
	const errMemo = () => state.err.get().length > 0;
	const valid = () => {
		const username = state.username.get();
		try {
			usernameSchema.parse({ username });
			return true;
		} catch (error) {
			return false;
		}
	};
	async function saveUsername() {
		if (!valid()) return;
		const res = await onboarding.setUsername(state.username.get());
		if (res.ok) {
			goToNextStep();
		} else {
			state.err.set(res.err);
		}
	}
	return (
		<Stack direction="col">
			<Card>
				<Heading as="h2">Pick a Screen Name</Heading>
				<p>Nearly done - just choose a public name people can call you.</p>
				<TextInput
					label="Your Username"
					get={state.username.get}
					set={state.username.set}
					validationSchema={usernameSchema}
					onValidationError={state.err.set}
				/>
				<ErrorMessage when={errMemo()}>{state.err.get()}</ErrorMessage>
				<Button
					onClick={saveUsername}
					disabled={!valid()}
				>
					Next
				</Button>
			</Card>
		</Stack>
	);
}
