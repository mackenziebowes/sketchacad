import { createSignal } from "solid-js";
import { AuthViewProvider } from "./Context";
import AuthViewContainer from "./Container";
import { useAuthPortal } from "~/global/individual/Auth";
import { Portal } from "solid-js/web";

const AuthPortal = () => {
	const { state } = useAuthPortal();

	return (
		<>
			{state.get() && (
				<Portal>
					<AuthViewProvider>
						<AuthViewContainer />
					</AuthViewProvider>
				</Portal>
			)}
		</>
	);
};

export default AuthPortal;
