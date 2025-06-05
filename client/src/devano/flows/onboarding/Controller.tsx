import { useOnboarding, OnboardingSteps } from "./Context";
import { Switch, Match } from "solid-js";
import { Screens } from "./screens";

export default function OnboardingController() {
	const { currentStep } = useOnboarding();
	return (
		<Switch fallback={<Screens.Skeleton />}>
			<Match when={currentStep() === OnboardingSteps.SubmitEmail}>
				<Screens.SubmitEmail />
			</Match>
			<Match when={currentStep() === OnboardingSteps.ConfirmEmail}>
				<Screens.ConfirmEmail />
			</Match>
			<Match when={currentStep() === OnboardingSteps.ChooseAuthMethod}>
				<Screens.ChooseAuthMethod />
			</Match>
			<Match when={currentStep() === OnboardingSteps.SetPassword}>
				<Screens.SetPassword />
			</Match>
			<Match when={currentStep() === OnboardingSteps.ChooseName}>
				<Screens.SubmitUsername />
			</Match>
			<Match when={currentStep() === OnboardingSteps.AgreeToTerms}>
				<Screens.AgreeTerms />
			</Match>
			<Match when={currentStep() === OnboardingSteps.Final}>
				<Screens.Final />
			</Match>
		</Switch>
	);
}
