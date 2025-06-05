import { OnboardingProvider } from "./Context";
import OnboardingController from "./Controller";

export default function Onboarding() {
	return (
		<OnboardingProvider>
			<OnboardingController />
		</OnboardingProvider>
	);
}
