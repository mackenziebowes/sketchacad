import { JSX, splitProps, Switch, Match } from "solid-js";
import { cn } from "~/devano/utils/cn";

interface HeadingProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
	as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading(props: HeadingProps) {
	const [local, rest] = splitProps(props, ["as", "children", "class"]);

	let headingCn = cn([
		{
			h1: "text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold",
			h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal md:font-semibold",
			h3: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium",
			h4: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium",
			h5: "text-base sm:text-lg md:text-xl lg:text-2xl font-normal",
			h6: "text-sm sm:text-base md:text-lg lg:text-xl font-normal",
		}[local.as],
		local.class,
	]);

	return (
		<Switch>
			<Match when={local.as === "h1"}>
				<h1
					class={headingCn}
					{...rest}
				>
					{local.children}
				</h1>
			</Match>
			<Match when={local.as === "h2"}>
				<h2
					class={headingCn}
					{...rest}
				>
					{local.children}
				</h2>
			</Match>
			<Match when={local.as === "h3"}>
				<h3
					class={headingCn}
					{...rest}
				>
					{local.children}
				</h3>
			</Match>
			<Match when={local.as === "h4"}>
				<h4
					class={headingCn}
					{...rest}
				>
					{local.children}
				</h4>
			</Match>
			<Match when={local.as === "h5"}>
				<h5
					class={headingCn}
					{...rest}
				>
					{local.children}
				</h5>
			</Match>
			<Match when={local.as === "h6"}>
				<h6
					class={headingCn}
					{...rest}
				>
					{local.children}
				</h6>
			</Match>
		</Switch>
	);
}
