import { AuthPortalProvider } from "./individual/Auth";
import { JSX } from "solid-js";
interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export default function Contexts(props: ProviderProps) {
	return <AuthPortalProvider>{props.children}</AuthPortalProvider>;
}
