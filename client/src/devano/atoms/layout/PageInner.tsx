import { JSX, splitProps } from "solid-js";
import { cn } from "~/devano/utils/cn";

interface PageInnerProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export default function PageInner(props: PageInnerProps) {
	const [l, rest] = splitProps(props, ["class"]);

	const innerCn = cn([
		"flex flex-col h-screen w-screen items-center justify-between",
		l?.class,
	]);

	return (
		<div
			class={innerCn}
			{...rest}
		>
			<div class="flex-none w-full px-[24px] py-[12px]">{/* <TopNav /> */}</div>
			<div class="flex-1 overflow-y-scroll pb-[24px]">{props.children}</div>
			<div class="flex items-center justify-center flex-none w-full py-[12px]">
				{/* <FooterNav /> */}
			</div>
		</div>
	);
}
