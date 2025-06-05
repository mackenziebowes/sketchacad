import Stack from "~/devano/atoms/layout/Stack";
import { Card } from "~/devano/atoms/layout/Card";

export default function Skeleton() {
	return (
		<Stack direction="col">
			<Card>
				<div class="animate-pulse space-y-4">
					<div class="h-6 bg-gray-300 rounded w-1/3"></div>
					<div class="h-4 bg-gray-300 rounded w-full"></div>
					<div class="h-4 bg-gray-300 rounded w-2/3"></div>
					<div class="h-10 bg-gray-300 rounded w-1/4"></div>
				</div>
			</Card>
		</Stack>
	);
}
