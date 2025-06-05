
import { JSX, splitProps } from "solid-js";
import { cn } from "~/devano/utils/cn";

interface IconButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	outline?: boolean;
	color?: "default" | "ara" | "ene" | "izi";
}

export default function IconButton(props: IconButtonProps) {
	const [l, rest] = splitProps(props, [
		"outline",
		"color",
		"class",
		"children",
	]);

	const color = l.color ?? "default";

	let className = cn([
		"select-none px-1 py-1 font-semibold rounded-md border-[2px] hover:cursor-pointer focus:outline-[1px] focus:outline-(--c-a-e)",
		{
			"border-(--fg-e) text-(--fg-e) hover:text-(--fg-i) hover:border-(--fg-i)":
				color == "default" && l?.outline == true,
			"border-(--fg-i) bg-(--fg-i) text-(--bg-e) hover:text-(--bg-i) hover:bg-(--fg-o) hover:border-(--fg-o)":
				color == "default" && l?.outline == undefined,
			"border-(--c-a-e) text-(--c-a-e) hover:text-(--c-a-i) hover:border-(--c-a-i)":
				color == "ara" && l?.outline == true,
			"border-(--c-a-e) text-(--bg-i) bg-(--c-a-e) hover:bg-(--c-a-i) hover:text-(--bg-o) hover:border-(--c-a-i)":
				color == "ara" && l?.outline == undefined,
			"border-(--c-e-e) text-(--c-e-e) hover:text-(--c-e-i) hover:border-(c-e-i)":
				color == "ene" && l?.outline == true,
			"border-(--c-e-e) text-(--bg-i) bg-(--c-e-e) hover:bg-(--c-e-i) hover:text-(--bg-o) hover:border-(--c-e-i)":
				color == "ene" && l?.outline == undefined,
			"border-(--c-i-e) text-(--c-i-e) hover:text-(--c-i-i) hover:border-(c-i-i)":
				color == "izi" && l?.outline == true,
			"border-(--c-i-e) text-(--bg-i) bg-(--c-i-e) hover:bg-(--c-i-i) hover:text-(--bg-o) hover:border-(--c-i-i)":
				color == "izi" && l?.outline == undefined,
		},
		l?.class,
	]);

	return (
		<button
			class={className}
			{...rest}
		>
			{l.children ?? ""}
		</button>
	);
}
