import {
	createContext,
	useContext,
	JSX,
	createSignal,
	type Accessor,
	type Setter,
} from "solid-js";

import type { FormItemState } from "~/types/FormItem";

export enum OnboardingSteps {
	SubmitEmail = "submit-email",
	ChooseAuthMethod = "choose-auth-method",
	SetPassword = "set-password",
	ConfirmEmail = "confirm-email",
	ChooseName = "choose-name",
	AgreeToTerms = "agree-to-terms",
	Final = "final",
}

interface FormState {
	email: FormItemState<string>;
	email_confirmation: FormItemState<string>;
	confirmed: FormItemState<boolean>;
	password: FormItemState<string>;
	username: FormItemState<string>;
	agreedToTerms: FormItemState<boolean>;
	complete: FormItemState<boolean>;
	err: FormItemState<string>;
}

interface OnboardingContextValue {
	currentStep: Accessor<OnboardingSteps>;
	goToNextStep: () => void;
	goToPreviousStep: () => void;
	setStep: Setter<OnboardingSteps>;
	state: FormState;
}

export const OnboardingContext = createContext<OnboardingContextValue>();

export const useOnboarding = () => {
	const context = useContext(OnboardingContext);
	if (!context) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
};

interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function OnboardingProvider(props: ProviderProps) {
	const [currentStep, setCurrentStep] = createSignal<OnboardingSteps>(
		OnboardingSteps.SubmitEmail
	);

	const [email, set_email] = createSignal<string>("");
	const [emailConfirmation, set_emailConfirmation] = createSignal<string>("");
	const [password, set_password] = createSignal<string>("");
	const [username, set_username] = createSignal<string>("");
	const [confirmed, set_confirmed] = createSignal<boolean>(false);
	const [agreedToTerms, set_agreedToTerms] = createSignal<boolean>(false);
	const [complete, set_complete] = createSignal<boolean>(false);
	const [err, set_err] = createSignal<string>("");

	const state: FormState = {
		email: {
			get: email,
			set: set_email,
		},
		email_confirmation: {
			get: emailConfirmation,
			set: set_emailConfirmation,
		},
		password: {
			get: password,
			set: set_password,
		},
		username: {
			get: username,
			set: set_username,
		},
		confirmed: {
			get: confirmed,
			set: set_confirmed,
		},
		agreedToTerms: {
			get: agreedToTerms,
			set: set_agreedToTerms,
		},
		complete: {
			get: complete,
			set: set_complete,
		},
		err: {
			get: err,
			set: set_err,
		},
	};

	const steps: OnboardingSteps[] = [
		OnboardingSteps.SubmitEmail,
		OnboardingSteps.ConfirmEmail,
		OnboardingSteps.ChooseAuthMethod,
		OnboardingSteps.SetPassword,
		OnboardingSteps.ChooseName,
		OnboardingSteps.AgreeToTerms,
		OnboardingSteps.Final,
	];

	const goToNextStep = () => {
		const currentIndex = steps.indexOf(currentStep());
		if (currentIndex < steps.length - 1) {
			setCurrentStep(steps[currentIndex + 1]);
		}
	};

	const goToPreviousStep = () => {
		const currentIndex = steps.indexOf(currentStep());
		if (currentIndex > 0) {
			setCurrentStep(steps[currentIndex - 1]);
		}
	};

	return (
		<OnboardingContext.Provider
			value={{
				currentStep,
				setStep: setCurrentStep,
				goToNextStep,
				goToPreviousStep,
				state,
			}}
		>
			{props.children}
		</OnboardingContext.Provider>
	);
}
