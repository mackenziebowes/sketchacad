import { JSX, splitProps } from "solid-js";
import { cn } from "~/devano/utils/cn";

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Card(props: CardProps) {
	let [l, rest] = splitProps(props, ["class", "children"]);

	let cardCN = cn([
		"flex flex-col w-[35ch] border-[2px] border-(--gh-e) px-[24px] py-[12px] pb-[24px] rounded-[12px] gap-[24px]",
		l?.class,
	]);

	return (
		<div
			class={cardCN}
			{...rest}
		>
			{l.children}
		</div>
	);
}
