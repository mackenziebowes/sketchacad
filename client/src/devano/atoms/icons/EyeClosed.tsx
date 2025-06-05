
import { JSX, splitProps } from "solid-js";
import { cn } from "~/devano/utils/cn";

export default function SVGArt(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	const [l, rest] = splitProps(props, ["width", "height", "class"]);
	return (
		<svg
			width={l.width ?? "100"}
			height={l.height ?? "60"}
			viewBox="0 0 100 60"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class={cn(["fill-current h-auto", l?.class])} // fill-current consumes the parent's "text color" value, h-auto makes it easy to proportionally resize the art
			{...rest}
		>
			<path d="M90 13.5C91.3807 13.5 92.5 14.6193 92.5 16C92.5 23.5926 89.7805 31.7988 82.9424 38.0898C76.1075 44.3779 65.4361 48.5 50 48.5C34.5639 48.5 23.8925 44.3779 17.0576 38.0898C10.2195 31.7988 7.5 23.5926 7.5 16C7.5 14.6193 8.61929 13.5 10 13.5C11.3807 13.5 12.5 14.6193 12.5 16C12.5 22.4073 14.7806 29.2012 20.4424 34.4102C26.1075 39.622 35.4362 43.5 50 43.5C64.5638 43.5 73.8925 39.622 79.5576 34.4102C85.2194 29.2012 87.5 22.4073 87.5 16C87.5 14.6193 88.6193 13.5 90 13.5Z" />
		</svg>
	);
}
