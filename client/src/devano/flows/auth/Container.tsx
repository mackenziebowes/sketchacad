import { useAuthView, AuthPages } from "./Context";
import { Switch, Match } from "solid-js";
// import { Screens } from "./screens";

export default function AuthViewContainer() {
	const { state } = useAuthView();
	return (
		<Switch fallback={<></>}>
			<></>
			{/* <Match when={currentStep() === OnboardingSteps.SubmitEmail}>
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
            </Match> */}
		</Switch>
	);
}
