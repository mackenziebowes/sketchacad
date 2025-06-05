import { A } from "@solidjs/router";
import Controller from "~/features/drawing/Controller";
export default function Home() {
	return (
		<main class="text-center mx-auto text-gray-700 p-4">
			<Controller />
		</main>
	);
}
