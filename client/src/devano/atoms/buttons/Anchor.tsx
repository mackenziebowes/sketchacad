import { JSX, splitProps } from "solid-js";
import { A } from "@solidjs/router";
import { cn } from "~/devano/utils/cn";

interface AnchorProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	color?: "default" | "ara" | "ene" | "izi";
	href: string;
	end?: boolean;
}

export function Anchor(props: AnchorProps) {
	const [l, rest] = splitProps(props, [
		"color",
		"class",
		"children",
		"href",
		"end",
	]);

	const color = l?.color ?? "default";
	const end = l?.end ?? true;

	let inactiveCn = cn([
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

	let activeCn = cn([
		"select-none font-semibold hover:cursor-pointer focus:outline-none",
		{
			"text-(--fg-a) hover:text-(--fg-e) focus:text-(--c-a-i)":
				color == "default",
			"text-(--c-a-a) hover:text-(--c-a-e) focus:text-(--fg-i)": color == "ara",
			"text-(--c-e-a) hover:text-(--c-e-e) focus:text-(--fg-i)": color == "ene",
			"text-(--c-i-a) hover:text-(--c-i-e) focus:text-(--fg-i)": color == "izi",
		},
		l?.class,
	]);

	return (
		<A
			href={l.href}
			inactiveClass={inactiveCn}
			activeClass={activeCn}
			{...rest}
			end={end}
		>
			{l?.children ?? ""}
		</A>
	);
}
