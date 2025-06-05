import {
	createContext,
	useContext,
	JSX,
	createSignal,
	createEffect,
} from "solid-js";
import { Tools } from "../ToolContext";

// Define the shape of our key state
interface KeyState {
	// Modifier keys
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	meta: boolean;

	// Tool shortcut keys
	keys: Set<string>;

	// Last key pressed (for debugging)
	lastKey: string;
}

// Commands that can be triggered by key combinations
interface KeyCommands {
	undo: () => void;
	redo: () => void;
	selectTool: (tool: Tools) => void;
}

// The context value shape
interface KeyContextValue {
	keyState: {
		get: {
			shift: () => boolean;
			ctrl: () => boolean;
			alt: () => boolean;
			meta: () => boolean;
			isPressed: (key: string) => boolean;
			lastKey: () => string;
		};
	};
	registerCommands: (commands: Partial<KeyCommands>) => void;
}

// Create the context
const KeyContext = createContext<KeyContextValue>();

// Provider props
interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

// The provider component
export function KeyProvider(props: ProviderProps) {
	// State for key tracking
	const [shift, setShift] = createSignal(false);
	const [ctrl, setCtrl] = createSignal(false);
	const [alt, setAlt] = createSignal(false);
	const [meta, setMeta] = createSignal(false);
	const [keys, setKeys] = createSignal<Set<string>>(new Set());
	const [lastKey, setLastKey] = createSignal("");

	// Commands that can be registered by consumers
	let commands: Partial<KeyCommands> = {};

	// Function to register commands
	function registerCommands(newCommands: Partial<KeyCommands>) {
		commands = { ...commands, ...newCommands };
	}

	// Setup key listeners on mount
	createEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			// Update modifier keys
			setShift(e.shiftKey);
			setCtrl(e.ctrlKey);
			setAlt(e.altKey);
			setMeta(e.metaKey);

			// Update pressed keys set
			setKeys((prev) => {
				const next = new Set(prev);
				next.add(e.key.toLowerCase());
				return next;
			});

			setLastKey(e.key);

			// Handle shortcuts
			if ((e.metaKey || e.ctrlKey) && e.key === "z") {
				e.preventDefault();
				if (e.shiftKey && commands.redo) {
					commands.redo();
				} else if (commands.undo) {
					commands.undo();
				}
			}

			// Tool shortcuts
			if (!e.metaKey && !e.ctrlKey && !e.altKey) {
				switch (e.key.toLowerCase()) {
					case "p":
						if (commands.selectTool) commands.selectTool(Tools.Pencil);
						break;
					case "e":
						if (commands.selectTool) commands.selectTool(Tools.Eraser);
						break;
					case "f":
						if (commands.selectTool) commands.selectTool(Tools.Fill);
						break;
					case "r":
						if (commands.selectTool) commands.selectTool(Tools.Rect);
						break;
					case "l":
						if (commands.selectTool) commands.selectTool(Tools.Line);
						break;
					case "c":
						if (commands.selectTool) commands.selectTool(Tools.Ellipse);
						break;
					case "a":
						if (commands.selectTool) commands.selectTool(Tools.Arc);
						break;
				}
			}
		}

		function handleKeyUp(e: KeyboardEvent) {
			// Update modifier keys
			setShift(e.shiftKey);
			setCtrl(e.ctrlKey);
			setAlt(e.altKey);
			setMeta(e.metaKey);

			// Remove from pressed keys
			setKeys((prev) => {
				const next = new Set(prev);
				next.delete(e.key.toLowerCase());
				return next;
			});
		}

		// When window loses focus, reset all key states
		function handleBlur() {
			setShift(false);
			setCtrl(false);
			setAlt(false);
			setMeta(false);
			setKeys(new Set<string>());
		}

		// Add event listeners
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("blur", handleBlur);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("blur", handleBlur);
		};
	});

	// Create the context value
	const contextValue: KeyContextValue = {
		keyState: {
			get: {
				shift: () => shift(),
				ctrl: () => ctrl(),
				alt: () => alt(),
				meta: () => meta(),
				isPressed: (key: string) => keys().has(key.toLowerCase()),
				lastKey: () => lastKey(),
			},
		},
		registerCommands,
	};

	return (
		<KeyContext.Provider value={contextValue}>
			{props.children}
		</KeyContext.Provider>
	);
}

// Hook to use the key context
export function useKey() {
	const context = useContext(KeyContext);
	if (!context) {
		throw new Error("useKey must be used within a KeyProvider");
	}
	return context;
}
