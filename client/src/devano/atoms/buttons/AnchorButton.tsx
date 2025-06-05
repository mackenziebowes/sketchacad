import { JSX, splitProps } from "solid-js";
import { cn } from "~/devano/utils/cn";

interface AnchorProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: "default" | "ara" | "ene" | "izi";
}

export function AnchorButton(props: AnchorProps) {
	const [l, rest] = splitProps(props, ["color", "class", "children"]);

	const color = l.color ?? "default";

	let className = cn([
		"select-none font-semibold hover:cursor-pointer focus:outline-none",
		{
			"text-(--fg-e) hover:text-(--fg-i) focus:text-(--c-a-e)":
				color == "default",
			"text-(--c-a-e) hover:text-(--c-a-i) focus:text-(--fg-i)": color == "ara",
			"text-(--c-e-e) hover:text-(--c-e-i) focus:text-(--fg-i)": color == "ene",
			"text-(--c-i-e) hover:text-(--c-i-i) focus:text-(--fg-i)": color == "izi",
		},
		l?.class,
	]);

	return (
		<button
			class={className}
			{...rest}
		>
			{l?.children ?? ""}
		</button>
	);
}
