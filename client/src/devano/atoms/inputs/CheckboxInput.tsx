import { JSX, splitProps, createSignal } from "solid-js";
import { cn } from "~/devano/utils/cn";
import type { Accessor, Setter } from "solid-js";

interface ExtendedCheckboxInputProps
	extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	get: Accessor<boolean>;
	set: Setter<boolean>;
}

export function CheckboxInput(props: ExtendedCheckboxInputProps) {
	const [l, most] = splitProps(props, ["class", "label", "get", "set"]);

	const [unused, rest] = splitProps(most, [
		"checked",
		"on:change",
		"onChange",
		"onchange",
	]);

	let className = cn([
		"select-none bg-(--bg-a) hover:bg-(--bg-e) rounded-[6px] px-[6px] py-[6px] border-[2px] border-(--fg-e) hover:border(--fg-i) focus:outline-[1px] focus:-outline-offset-[2px] focus:outline-(--c-a-e)",
		l?.class,
	]);

	const handleChange = (evt: Event) => {
		const target = evt.currentTarget as HTMLInputElement;
		l.set(target.checked);
	};

	return (
		<div class="flex items-center gap-[8px]">
			<input
				type="checkbox"
				class={className}
				checked={l.get()}
				onChange={handleChange}
				{...rest}
			/>
			<label class="text-[14px] select-none">{l.label}</label>
		</div>
	);
}
