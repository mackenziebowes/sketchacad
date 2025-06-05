import { createContext, useContext, JSX, createSignal } from "solid-js";
import type { FormItemState } from "~/types/FormItem";
import chroma, { type Color } from "chroma-js";
// Types and stuff

export enum Tools {
	Pencil,
	Eraser,
	Fill,
	Rect,
	Line,
	Ellipse,
	Arc,
}
// multiply, darken, lighten, screen, overlay, burn, and dodge.
export enum BlendMode {
	Normal,
	Multiply,
	Darken,
	Lighten,
	Screen,
	Overlay,
	Burn,
	Dodge,
}

// Context
interface ToolContextValue {
	tool_state: {
		panelOpen: FormItemState<boolean>;
		currentTool: FormItemState<Tools>;
		currentColor: FormItemState<Color>;
		blendMode: FormItemState<BlendMode>;
	};
}
export const ToolContext = createContext<ToolContextValue>();

interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function ToolProvider(props: ProviderProps) {
	const [isPanelOpen, set_isPanelOpen] = createSignal<boolean>(false);
	const [currentTool, set_currentTool] = createSignal<Tools>(Tools.Pencil);
	const [currentColor, set_currentColor] = createSignal<Color>(chroma("black"));
	const [blendMode, set_blendMode] = createSignal<BlendMode>(BlendMode.Normal);
	const tool_state = {
		panelOpen: {
			get: isPanelOpen,
			set: set_isPanelOpen,
		},
		currentTool: {
			get: currentTool,
			set: set_currentTool,
		},
		currentColor: {
			get: currentColor,
			set: set_currentColor,
		},
		blendMode: {
			get: blendMode,
			set: set_blendMode,
		},
	};
	return (
		<ToolContext.Provider value={{ tool_state }}>
			{props.children}
		</ToolContext.Provider>
	);
}
export const useTool = () => {
	const context = useContext(ToolContext);
	if (!context) {
		throw new Error("useTool must be used within an ToolProvider");
	}
	return context;
};
