import { JSX, splitProps } from "solid-js";

export function Page(props: JSX.HTMLAttributes<HTMLElement>) {
	const [l, rest] = splitProps(props, ["class"]);
	return (
		<main
			class="flex flex-col w-full min-h-[100vh] gap-[48px] items-center bg-(--bg-e) text-(--fg-e)"
			{...rest}
		/>
	);
}
