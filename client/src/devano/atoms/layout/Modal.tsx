import { Portal, Show, Switch, Match } from "solid-js/web";
import { JSX, splitProps } from "solid-js";
import { Card } from "./Card";

interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
	when: boolean;
	close: Function;
}
export default function Modal(props: ModalProps) {
	const [l, rest] = splitProps(props, ["when", "children", "close"]);

	return (
		<Switch fallback={<></>}>
			<Match when={l.when}>
				<Portal>
					<div
						onClick={() => l.close()}
						class="w-[100vw] h-[100vh] left-0 top-0 absolute bg-(--bg-a) opacity-25 z-2"
					/>
					<Card
						class="absolute left-[50%] top-[50%] bg-(--bg-e) text-(--fg-e) z-3"
						style={{ transform: "translateX(-50%) translateY(-50%)" }}
					>
						{l?.children}
					</Card>
				</Portal>
			</Match>
		</Switch>
	);
}
