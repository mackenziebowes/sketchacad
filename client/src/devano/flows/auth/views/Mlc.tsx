import { ErrorMessage } from "~/devano/atoms/feedback/ErrorMessage";
import { AuthPages, useAuthView } from "../Context";
import AuthCard from "../components/AuthCard";
import { onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { auth } from "../api";

export default function Mlc() {
	const { state } = useAuthView();
	async function confirmMLC(code: string) {
		const res = await auth.confirmMagicLink(code);
		if (res.ok) {
			state.view.set(AuthPages.Null);
		} else {
			state.err.set(res.err);
		}
	}
	onMount(() => {
		const { code } = useParams();
		if (code) {
			console.log("Code query param:", code);
			confirmMLC(code);
		} else {
			state.err.set("No Magic Link Code supplied.");
		}
	});
	return (
		<AuthCard
			title="Magic Link Login"
			subtitle={"Logging in..."}
		>
			<ErrorMessage when={state.err.get().length > 0}>
				<p>{state.err.get()}</p>
			</ErrorMessage>
		</AuthCard>
	);
}
