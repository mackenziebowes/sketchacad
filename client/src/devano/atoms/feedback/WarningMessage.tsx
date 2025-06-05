import { cn } from "~/devano/utils/cn";
import { JSX, splitProps, Show } from "solid-js";

interface WarningMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
	when: boolean;
}

/**
 *
 * @props when Required - when to show the message
 * @props children What to show inside the message - use a fragment `<></>` for multiple children
 * @props class Extend/override default styles
 * @returns
 */
export function WarningMessage(props: WarningMessageProps) {
	const [l, rest] = splitProps(props, ["when", "class", "children"]);
	const warningCn = cn([
		"flex gap-[6px] px-[12px] py-[6px] bg-(--c-a-a) text-(--c-a-i)",
		l?.class,
	]);
	return (
		<Show when={l.when}>
			<div
				class={warningCn}
				{...rest}
			>
				{l.children}
			</div>
		</Show>
	);
}
