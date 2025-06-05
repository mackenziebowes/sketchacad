import { onMount, onCleanup, createEffect } from "solid-js";
import { useKey } from "./hooks/KeyContext";
import { useTool, Tools } from "./ToolContext";
import { useGrid, type Grid } from "./Context";

export function KeyInputs() {
	const { keyState, registerCommands } = useKey();
	const { tool_state } = useTool();
	const { grid_state } = useGrid();

	// Track history arrays for undo/redo
	// This is a simplified example - you might want a more robust history system
	let xzHistory: Array<Grid> = [];
	let xyHistory: Array<Grid> = [];
	let yzHistory: Array<Grid> = [];
	let historyIndex = -1;

	// Save current state to history
	function saveToHistory() {
		// Remove any future history if we're not at the latest state
		if (historyIndex < xzHistory.length - 1) {
			xzHistory = xzHistory.slice(0, historyIndex + 1);
			xyHistory = xyHistory.slice(0, historyIndex + 1);
			yzHistory = yzHistory.slice(0, historyIndex + 1);
		}

		// Add current state to history
		xzHistory.push(new Map(grid_state.xz.get()));
		xyHistory.push(new Map(grid_state.xy.get()));
		yzHistory.push(new Map(grid_state.yz.get()));

		// Limit history length to prevent memory issues
		if (xzHistory.length > 50) {
			xzHistory.shift();
			xyHistory.shift();
			yzHistory.shift();
		} else {
			historyIndex++;
		}
	}

	// Undo function
	function undo() {
		if (historyIndex > 0) {
			historyIndex--;
			grid_state.xz.set(new Map(xzHistory[historyIndex]));
			grid_state.xy.set(new Map(xyHistory[historyIndex]));
			grid_state.yz.set(new Map(yzHistory[historyIndex]));
			grid_state.repaint.set(grid_state.repaint.get() + 1);
		}
	}

	// Redo function
	function redo() {
		if (historyIndex < xzHistory.length - 1) {
			historyIndex++;
			grid_state.xz.set(new Map(xzHistory[historyIndex]));
			grid_state.xy.set(new Map(xyHistory[historyIndex]));
			grid_state.yz.set(new Map(yzHistory[historyIndex]));
			grid_state.repaint.set(grid_state.repaint.get() + 1);
		}
	}

	// Register our command handlers with the KeyContext
	onMount(() => {
		// Initial history state
		saveToHistory();

		// Register commands
		registerCommands({
			undo,
			redo,
			selectTool: (tool: Tools) => {
				tool_state.currentTool.set(tool);
			},
		});

		// Create an effect to watch for grid changes and save to history
		// This would need to be more sophisticated in a real app
		const gridChangeWatcher = setInterval(() => {
			// Only save if something has changed
			if (
				xzHistory.length === 0 ||
				!mapsEqual(grid_state.xz.get(), xzHistory[historyIndex]) ||
				!mapsEqual(grid_state.xy.get(), xyHistory[historyIndex]) ||
				!mapsEqual(grid_state.yz.get(), yzHistory[historyIndex])
			) {
				saveToHistory();
			}
		}, 1000); // Check every second

		onCleanup(() => {
			clearInterval(gridChangeWatcher);
		});
	});

	// Helper to compare maps
	function mapsEqual(a: Grid, b: Grid): boolean {
		if (a.size !== b.size) return false;
		for (const [key, val] of a) {
			if (!b.has(key) || b.get(key) !== val) return false;
		}
		return true;
	}

	// Debug display for key state
	createEffect(() => {
		// You can use this to debug key states
		const shift = keyState.get.shift();
		const ctrl = keyState.get.ctrl();
		const lastKey = keyState.get.lastKey();

		// Uncomment to see state in console
		// console.log(`Shift: ${shift}, Ctrl: ${ctrl}, Last key: ${lastKey}`);
	});

	return null;
}
