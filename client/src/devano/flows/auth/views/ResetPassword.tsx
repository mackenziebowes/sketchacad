import { Button } from "~/devano/atoms/buttons/Button";
import { TextInput } from "~/devano/atoms/inputs/TextInput";
import { useAuthView } from "../Context";
import AuthCard from "../components/AuthCard";
import { auth } from "../api";
import { z } from "zod";

const emailSchema = z.object({
	email: z.string().email(),
});

export default function ResetPassword() {
	const { state } = useAuthView();
	async function handleResetRequest() {
		const email = state.email.get();
		const parsedData = emailSchema.safeParse({
			email,
		});
		if (!parsedData.success) {
			state.err.set(
				parsedData.error.errors.map((err) => err.message).join(",\n")
			);
			return;
		}
		const res = await auth.requestReset(email);
		if (res.ok) {
			state.msg.set(res.msg);
		} else {
			state.err.set(res.err);
		}
	}
	return (
		<AuthCard title="Reset Password">
			<TextInput
				label="Email"
				get={state.email.get}
				set={state.email.set}
				validationSchema={emailSchema}
				onValidationError={state.err.set}
			/>
			<Button onclick={handleResetRequest}>Request Reset</Button>
		</AuthCard>
	);
}
