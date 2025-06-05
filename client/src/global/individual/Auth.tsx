import { createContext, useContext, createSignal, JSX } from "solid-js";
import AuthPortal from "~/devano/flows/auth";
import type { FormItemState } from "~/types/FormItem";

interface AuthPortalValue {
	state: FormItemState<boolean>;
	togglePortal: () => void;
}

const AuthPortalContext = createContext<AuthPortalValue>();

interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const AuthPortalProvider = (props: ProviderProps) => {
	const [isOpen, setIsOpen] = createSignal(false);
	const state = {
		get: isOpen,
		set: setIsOpen,
	};
	const togglePortal = () => setIsOpen(!isOpen());

	return (
		<AuthPortalContext.Provider value={{ state, togglePortal }}>
			{props.children}
			<AuthPortal />
		</AuthPortalContext.Provider>
	);
};

export const useAuthPortal = () => {
	const context = useContext(AuthPortalContext);
	if (!context) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
};
