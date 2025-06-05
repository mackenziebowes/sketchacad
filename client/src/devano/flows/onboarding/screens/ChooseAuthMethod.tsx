import Stack from "~/devano/atoms/layout/Stack";
import { Card } from "~/devano/atoms/layout/Card";
import { Heading } from "~/devano/atoms/layout/Heading";
import { Button } from "~/devano/atoms/buttons/Button";
import { useOnboarding, OnboardingSteps } from "../Context";

export default function ChooseAuthMethod() {
	const { setStep } = useOnboarding();
	return (
		<Stack direction="col">
			<Card>
				<Heading as="h2">Want a password?</Heading>
				<p>If you like using passwords, you can choose to set one.</p>
				<p>
					If you don't like passwords, we can use a Magic Link system to log you
					in via email.
				</p>
				<Stack direction="row">
					<Button
						onClick={() => setStep(OnboardingSteps.SetPassword)}
						color="ara"
					>
						Password
					</Button>
					<Button
						onClick={() => setStep(OnboardingSteps.ChooseName)}
						color="ene"
					>
						Magic Link
					</Button>
				</Stack>
			</Card>
		</Stack>
	);
}
