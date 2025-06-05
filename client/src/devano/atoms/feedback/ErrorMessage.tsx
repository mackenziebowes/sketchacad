import { cn } from "~/devano/utils/cn";
import { JSX, splitProps, Show } from "solid-js";

interface ErrorMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
	when: boolean;
}

/**
 *
 * @props when Required - when to show the message
 * @props children What to show inside the message - use a fragment `<></>` for multiple children
 * @props class Extend/override default styles
 * @returns
 */
export function ErrorMessage(props: ErrorMessageProps) {
	const [l, rest] = splitProps(props, ["when", "class", "children"]);
	const errorCn = cn([
		"flex gap-[6px] px-[12px] py-[6px] bg-(--c-i-a) text-(--c-i-i)",
		l?.class,
	]);
	return (
		<Show when={l.when}>
			<div
				class={errorCn}
				{...rest}
			>
				{l.children}
			</div>
		</Show>
	);
}
