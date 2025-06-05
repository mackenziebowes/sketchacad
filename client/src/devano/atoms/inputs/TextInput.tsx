import { JSX, splitProps, createSignal } from "solid-js";
import { cn } from "~/devano/utils/cn";
import type { Accessor, Setter } from "solid-js";
import { ZodType, ZodError } from "zod";

interface ExtendedTextInputProps
	extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	get: Accessor<string>;
	set: Setter<string>;
	validationSchema?: ZodType<any>;
	onValidationError?: (error: string) => void;
}

interface ExtendedInputEvent extends InputEvent {
	currentTarget: HTMLInputElement;
	target: HTMLInputElement;
}

export function TextInput(props: ExtendedTextInputProps) {
	const [l, most] = splitProps(props, [
		"class",
		"label",
		"placeholder",
		"get",
		"set",
		"validationSchema",
		"onValidationError",
	]);
	const [unused, rest] = splitProps(most, [
		"value",
		"on:change",
		"onChange",
		"onchange",
		"on:input",
		"onInput",
		"oninput",
		"on:blur",
		"onBlur",
		"onblur",
	]);

	const [error, set_error] = createSignal<string | null>(null);

	let className = cn([
		"select-none bg-(--bg-a) hover:bg-(--bg-e) rounded-[6px] px-[6px] py-[6px] border-[2px] border-(--fg-e) hover:border(--fg-i) focus:outline-[1px] focus:-outline-offset-[2px] focus:outline-(--c-a-e)",
		l?.class,
		error() ? "border-(--c-e-e) hover:border-(--c-e-i)" : "",
	]);

	const handleBlur = () => {
		if (l.validationSchema) {
			try {
				l.validationSchema.parse(l.get());
				set_error(null);
			} catch (err) {
				if (err instanceof ZodError) {
					const errorMessage = err.errors[0]?.message || "Invalid Input";
					if (l.onValidationError) {
						l.onValidationError(errorMessage);
					} else {
						// ie, if l.onValidationError doesn't exist, we're working with pure vibes.
						set_error(errorMessage);
					}
				}
			}
		}
	};

	const handleInput = (evt: ExtendedInputEvent) => {
		if (l.validationSchema && l.onValidationError) {
			// clear the error message when someone starts typing
			l.onValidationError("");
		} else {
			set_error("");
		}
		l.set(evt.currentTarget.value);
	};

	return (
		<div class="flex flex-col gap-[2px]">
			<label class="text-[14px] select-none ">{l.label}</label>
			<input
				placeholder={l?.placeholder || l.label}
				class={className}
				value={l.get()}
				onInput={handleInput}
				onBlur={handleBlur}
				{...rest}
			/>
			{error() && <span class="text-(--c-e-e) text-[12px]">{error()}</span>}
		</div>
	);
}
