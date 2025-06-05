import { createContext, useContext } from "solid-js";
import { useGrid, type GridPoint } from "../Context";
import { useTool, Tools, BlendMode } from "../ToolContext";
import chroma, { type Color } from "chroma-js";
import { JSX, createSignal } from "solid-js";

import type { GridSelection, Pixel, DrawArgs } from "./types";

interface DrawValue {
	onPointerDown: (args: DrawArgs) => void;
	onPointerMove: (args: DrawArgs) => void;
	onPointerUp: (args: DrawArgs) => void;
}

const DrawContext = createContext<DrawValue>();

interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export function DrawProvider(props: ProviderProps) {
	const { grid_state } = useGrid();
	const { tool_state } = useTool();
	const [start, set_start] = createSignal<Pixel | null>(null);
	const [isDrawing, set_isDrawing] = createSignal(false);
	const [lastPoint, set_lastPoint] = createSignal<Pixel | null>(null);
	// All your handlers here, using grid and tool
	function drawPixel(args: DrawArgs) {
		const { grid, point } = args;
		switch (grid) {
			case "xz":
				grid_state.xz.set((prev) => {
					const next = new Map(prev);
					// check if pixel set
					const curr = next.get(`${point.x},${point.y}`);
					let c: Color = tool_state.currentColor.get();
					if (curr) {
						c = computeBlendColor(curr);
					}
					next.set(`${point.x},${point.y}`, c);
					return next;
				});
				break;
			case "xy":
				grid_state.xy.set((prev) => {
					const next = new Map(prev);
					const curr = next.get(`${point.x},${point.y}`);
					let c: Color = tool_state.currentColor.get();
					if (curr) {
						c = computeBlendColor(curr);
					}
					next.set(`${point.x},${point.y}`, c);
					return next;
				});
				break;
			case "yz":
				grid_state.yz.set((prev) => {
					const next = new Map(prev);
					const curr = next.get(`${point.x},${point.y}`);
					let c: Color = tool_state.currentColor.get();
					if (curr) {
						c = computeBlendColor(curr);
					}
					next.set(`${point.x},${point.y}`, c);
					return next;
				});
				break;
		}
	}
	function deletePixel(args: DrawArgs) {
		const { grid, point } = args;
		switch (grid) {
			case "xz":
				grid_state.xz.set((prev) => {
					const next = new Map(prev);
					next.delete(`${point.x},${point.y}`);
					return next;
				});
				break;
			case "xy":
				grid_state.xy.set((prev) => {
					const next = new Map(prev);
					next.delete(`${point.x},${point.y}`);
					return next;
				});
				break;
			case "yz":
				grid_state.yz.set((prev) => {
					const next = new Map(prev);
					next.delete(`${point.x},${point.y}`);
					return next;
				});
				break;
		}
	}

	function onPointerDown(args: DrawArgs) {
		const { grid, point, modifiers } = args;
		const tool = tool_state.currentTool.get();
		
		// Handle shift key for straight lines
		if (modifiers?.shift && tool === Tools.Pencil) {
			set_start(point);
			set_isDrawing(true);
			drawPixel({ grid, point });
			return;
		}
		
		if (tool === Tools.Rect) set_start(point);
		if (tool === Tools.Line) set_start(point);
		if (tool === Tools.Pencil) {
			set_isDrawing(true);
			set_lastPoint(point);
			drawPixel({ grid, point });
		}
		if (tool === Tools.Eraser) {
			set_isDrawing(true);
			set_lastPoint(point);
			deletePixel({ grid, point });
		}
	}
	
	function onPointerMove(args: DrawArgs) {
		const { grid, point, modifiers } = args;
		const tool = tool_state.currentTool.get();
		let id = isDrawing();
		let lp = lastPoint();
		let s = start();
		
		// If shift key is down and we started drawing with pencil, show a straight line preview
		if (modifiers?.shift && tool === Tools.Pencil && id && s) {
			// We could implement a preview here
			return;
		}
		
		if (tool === Tools.Pencil && id && lp) {
			// Draw a line from lastPoint to point (to avoid gaps)
			drawLine(grid, lp, point);
			set_lastPoint(point);
		}
		if (tool === Tools.Eraser && id && lp) {
			// Draw a line from lastPoint to point (to avoid gaps)
			eraseLine(grid, lp, point);
			set_lastPoint(point);
		}
		// if (tool === Tools.Rect && s) {
		//     // Optionally: show a preview rectangle
		// }
	}
	
	function onPointerUp(args: DrawArgs) {
		const { grid, point, modifiers } = args;
		const tool = tool_state.currentTool.get();
		let s = start();
		
		// Handle shift key for straight lines
		if (modifiers?.shift && tool === Tools.Pencil && s) {
			drawLine(grid, s, point);
			set_isDrawing(false);
			set_start(null);
			return;
		}
		
		if (tool === Tools.Pencil) {
			set_isDrawing(false);
			set_lastPoint(null);
		}
		if (tool === Tools.Eraser) {
			set_isDrawing(false);
			set_lastPoint(null);
		}
		if (tool === Tools.Line && s) {
			drawLine(grid, s, point);
			set_start(null);
		}
		if (tool === Tools.Rect && s) {
			// Fill all pixels in the rectangle from start to point
			for (let x = Math.min(s.x, point.x); x <= Math.max(s.x, point.x); x++) {
				for (let y = Math.min(s.y, point.y); y <= Math.max(s.y, point.y); y++) {
					drawPixel({ grid, point: { x, y } });
				}
			}
			set_start(null);
		}
	}

	function drawLine(grid: GridSelection, from: Pixel, to: Pixel) {
		const dx = Math.abs(to.x - from.x);
		const dy = Math.abs(to.y - from.y);
		const sx = from.x < to.x ? 1 : -1;
		const sy = from.y < to.y ? 1 : -1;
		let err = dx - dy;
		let x = from.x;
		let y = from.y;
		while (true) {
			drawPixel({ grid, point: { x, y } });
			if (x === to.x && y === to.y) break;
			const e2 = 2 * err;
			if (e2 > -dy) {
				err -= dy;
				x += sx;
			}
			if (e2 < dx) {
				err += dx;
				y += sy;
			}
		}
	}

	function eraseLine(grid: GridSelection, from: Pixel, to: Pixel) {
		const dx = Math.abs(to.x - from.x);
		const dy = Math.abs(to.y - from.y);
		const sx = from.x < to.x ? 1 : -1;
		const sy = from.y < to.y ? 1 : -1;
		let err = dx - dy;
		let x = from.x;
		let y = from.y;
		while (true) {
			deletePixel({ grid, point: { x, y } });
			if (x === to.x && y === to.y) break;
			const e2 = 2 * err;
			if (e2 > -dy) {
				err -= dy;
				x += sx;
			}
			if (e2 < dx) {
				err += dx;
				y += sy;
			}
		}
	}

	function computeBlendColor(t: Color) {
		const c = tool_state.currentColor.get();
		switch (tool_state.blendMode.get()) {
			case BlendMode.Normal:
				return tool_state.currentColor.get();
			case BlendMode.Multiply:
				return chroma.blend(c, t, "multiply");
			case BlendMode.Screen:
				return chroma.blend(c, t, "screen");
			case BlendMode.Burn:
				return chroma.blend(c, t, "burn");
			case BlendMode.Darken:
				return chroma.blend(c, t, "darken");
			case BlendMode.Dodge:
				return chroma.blend(c, t, "dodge");
			case BlendMode.Lighten:
				return chroma.blend(c, t, "darken");
			case BlendMode.Overlay:
				return chroma.blend(c, t, "overlay");
		}
	}

	return (
		<DrawContext.Provider
			value={{
				onPointerDown,
				onPointerMove,
				onPointerUp,
			}}
		>
			{props.children}
		</DrawContext.Provider>
	);
}

export function useDraw() {
	const ctx = useContext(DrawContext);
	if (!ctx) throw new Error("useDraw must be used within a DrawProvider");
	return ctx;
}
