import { JSX, Match, splitProps, Switch, createSignal } from "solid-js";
import { cn } from "~/devano/utils/cn";
import IconButton from "~/devano/atoms/buttons/IconButton";
import EyeOpen from "~/devano/atoms/icons/EyeOpen";
import EyeClosed from "~/devano/atoms/icons/EyeClosed";
import type { Accessor, Setter } from "solid-js";
import { ZodType, ZodError } from "zod";

interface ExtendedPasswordInputProps
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

export function PasswordInput(props: ExtendedPasswordInputProps) {
	const [vis, setVis] = createSignal(false);
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
		"select-none focus:outline-none focus:border-[transparent] flex-1",
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
						set_error(errorMessage);
					}
				}
			}
		}
	};

	const handleInput = (evt: ExtendedInputEvent) => {
		if (l.validationSchema && l.onValidationError) {
			l.onValidationError("");
		} else {
			set_error("");
		}
	};

	return (
		<div class="flex flex-col gap-[2px]">
			<label class="text-[14px] select-none">{l.label}</label>
			<div class="has-[input:focus-within]:outline-[1px] has-[input:focus-within]:-outline-offset-[2px] has-[input:focus-within]:outline-(--c-a-e) flex bg-(--bg-a) hover:bg-(--bg-e) rounded-[6px] px-[6px] py-[6px] border-[2px] border-(--fg-e) hover:border(--fg-i)">
				<input
					type={vis() ? "text" : "password"}
					placeholder={l?.placeholder || l.label}
					class={className}
					value={l.get()}
					onInput={handleInput}
					onBlur={handleBlur}
					{...rest}
				/>
				<Switch fallback={<></>}>
					<Match when={vis() == false}>
						<IconButton onClick={() => setVis(true)}>
							<EyeOpen class="w-[24px]" />
						</IconButton>
					</Match>
					<Match when={vis() == true}>
						<IconButton onClick={() => setVis(false)}>
							<EyeClosed class="w-[24px]" />
						</IconButton>
					</Match>
				</Switch>
			</div>
			{error() && <span class="text-(--c-e-e) text-[12px]">{error()}</span>}
		</div>
	);
}
