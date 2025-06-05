import { GridProvider } from "./Context";
import { ToolProvider } from "./ToolContext";
import { DrawProvider } from "./hooks/DrawContext";
import { KeyProvider } from "./hooks/KeyContext";
import Stack from "~/devano/atoms/layout/Stack";
import { Heading } from "~/devano/atoms/layout/Heading";
import Internal from "./Internal";
import { KeyInputs } from "./KeyInputs";

export default function Controller() {
	return (
		<GridProvider>
			<ToolProvider>
				<KeyProvider>
					<DrawProvider>
						<Stack direction="col">
							<Heading as="h1">Sketchacad</Heading>
							<Internal />
							<KeyInputs />
						</Stack>
					</DrawProvider>
				</KeyProvider>
			</ToolProvider>
		</GridProvider>
	);
}
