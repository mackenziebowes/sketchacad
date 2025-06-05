
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
			<path d="M50.0117 24.5C56.9153 24.5 62.5117 25.0964 62.5117 34C62.5117 40.9036 56.9153 46.5 50.0117 46.5C43.1082 46.5 37.5117 40.9036 37.5117 34C37.5117 25.0964 43.1082 24.5 50.0117 24.5Z" />
			<path d="M50.0117 7.5C81.3924 7.5 92.5117 28.6193 92.5117 40C92.5117 41.3807 91.3924 42.5 90.0117 42.5C88.631 42.5 87.5117 41.3807 87.5117 40C87.5117 31.3807 78.631 12.5 50.0117 12.5C21.3924 12.5 12.5117 31.3807 12.5117 40C12.5117 41.3807 11.3924 42.5 10.0117 42.5C8.63101 42.5 7.51172 41.3807 7.51172 40C7.51172 28.6193 18.631 7.5 50.0117 7.5Z" />
		</svg>
	);
}
