import { JSX, splitProps } from "solid-js";
import { cn } from "~/devano/utils/cn";

interface StackProps extends JSX.HTMLAttributes<HTMLDivElement> {
	direction?: "row" | "col";
}

/**
 *
 * 	@prop class standard classnames, use to extend or overwrite defaults.
 *	@prop direction "row" | "col" -> makes a row or column
 */
export default function Stack(props: StackProps) {
	const [l, rest] = splitProps(props, ["children", "class", "direction"]);

	let className = cn([
		"flex gap-[12px] items-center z-1",
		{
			"flex-col gap-[6px]": l?.direction === "col",
		},
		l?.class,
	]);

	return (
		<div
			class={className}
			{...rest}
		>
			{l.children}
		</div>
	);
}
