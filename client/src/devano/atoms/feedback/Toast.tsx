import {
	createContext,
	useContext,
	createSignal,
	JSX,
	ParentComponent,
	onMount,
	createEffect,
} from "solid-js";
import { cn } from "~/devano/utils/cn";

type Toast = {
	id: string;
	message: string;
	class?: string;
	timeout: number;
};

type ToastArgs = {
	message: string;
	timeout?: number;
	class?: string;
};

type ToastContextType = {
	toast: (args: ToastArgs) => void;
};

const ToastContext = createContext<ToastContextType>();

export const ToastProvider: ParentComponent = (props) => {
	const [toasts, setToasts] = createSignal<Toast[]>([]);

	const toast = ({ message, timeout = 3000, class: className }: ToastArgs) => {
		const id = Math.random().toString(36).substr(2, 9);
		setToasts((prev) => [...prev, { id, message, class: className, timeout }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, timeout); // Auto-remove toast after the specified timeout
	};

	return (
		<ToastContext.Provider value={{ toast }}>
			{props.children}
			<div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
				{toasts().map((t) => (
					<Toast
						message={t.message}
						class={t.class}
						timeout={t.timeout}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};

export const Toast: ParentComponent<ToastArgs> = (props) => {
	return (
		<div
			class={cn(
				"mb-2 p-3 bg-(--c-a-i) text-(--bg-e) rounded shadow-lg",
				props.class
			)}
		>
			{props.message}
		</div>
	);
};
