import { createEffect, createSignal } from "solid-js";
import { useGrid } from "./Context";
import { useDraw } from "./hooks/DrawContext";
import { useKey } from "./hooks/KeyContext";

export function Grid({ gridKey }: { gridKey: "xz" | "xy" | "yz" }) {
	const { grid_state } = useGrid();
	const { onPointerDown, onPointerMove, onPointerUp } = useDraw();
	const { keyState } = useKey();
	const grid = grid_state[gridKey];
	const bgGrid = grid_state[`bg${gridKey}`];
	const gridSize = grid_state.gridSize.get();
	let repaint = grid_state.repaint.get();
	const [hoveredCell, setHoveredCell] = createSignal<{ x: number, y: number } | null>(null);
	
	const shouldRepaint = () => {
		return repaint === grid_state.repaint.get();
	};
	
	// Handle mouse events with keyboard modifiers
	const handleMouseDown = (x: number, y: number) => {
		onPointerDown({ 
			grid: gridKey, 
			point: { x, y },
			modifiers: {
				shift: keyState.get.shift(),
				ctrl: keyState.get.ctrl(),
				alt: keyState.get.alt(),
				meta: keyState.get.meta()
			}
		});
	};
	
	const handleMouseMove = (x: number, y: number) => {
		setHoveredCell({ x, y });
		onPointerMove({ 
			grid: gridKey, 
			point: { x, y },
			modifiers: {
				shift: keyState.get.shift(),
				ctrl: keyState.get.ctrl(),
				alt: keyState.get.alt(),
				meta: keyState.get.meta()
			}
		});
	};
	
	const handleMouseUp = (x: number, y: number) => {
		onPointerUp({ 
			grid: gridKey, 
			point: { x, y },
			modifiers: {
				shift: keyState.get.shift(),
				ctrl: keyState.get.ctrl(),
				alt: keyState.get.alt(),
				meta: keyState.get.meta()
			}
		});
	};
	
	return (
		<div
			class="grid border border-1 border-[#000] w-[100%] h-[100%]"
			style={{ "grid-template-columns": `repeat(${gridSize}, 1fr)` }}
		>
			{[...Array(gridSize)].map((_, y) =>
				[...Array(gridSize)].map((_, x) => {
					const color = grid.get().get(`${x},${y}`);
					const bgColor = bgGrid.get(`${x},${y}`);
					const hovered = hoveredCell() && hoveredCell()!.x === x && hoveredCell()!.y === y;
					
					return (
						<div
							data-repaint={shouldRepaint()}
							class={`w-fill h-fill ${hovered ? 'hover:ring-1 ring-blue-500' : ''}`}
							style={{
								background: color?.hex() || bgColor?.hex() || "#ffffff",
								cursor: keyState.get.shift() ? "crosshair" : "default"
							}}
							onmousedown={() => handleMouseDown(x, y)}
							onmousemove={() => handleMouseMove(x, y)}
							onmouseup={() => handleMouseUp(x, y)}
						/>
					);
				})
			)}
		</div>
	);
}
