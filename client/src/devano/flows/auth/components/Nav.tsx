import Stack from "~/devano/atoms/layout/Stack";
import { AnchorButton } from "~/devano/atoms/buttons/AnchorButton";
import { useAuthView, AuthPages } from "../Context";
import { Show } from "solid-js";

export default function AuthNav() {
	const { state } = useAuthView();
	return (
		<Stack
			direction="row"
			class="justify-between px-4"
		>
			<Show when={state.view.get() !== AuthPages.Login}>
				<AnchorButton onClick={() => state.view.set(AuthPages.Login)}>
					Log In
				</AnchorButton>
			</Show>
			<Show when={state.view.get() !== AuthPages.ResetPassword}>
				<AnchorButton onClick={() => state.view.set(AuthPages.ResetPassword)}>
					Reset Password
				</AnchorButton>
			</Show>
		</Stack>
	);
}
