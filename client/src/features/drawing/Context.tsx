import { createContext, useContext, JSX, createSignal, createEffect } from "solid-js";
import chroma, { type Color } from "chroma-js";
import type { FormItemState } from "~/types/FormItem";

interface GridControlVal {
	grid_state: FormState;
	initGrid: () => void;
}

export const GridContext = createContext<GridControlVal>();

export type GridPoint = `${string},${string}`;
export type VoxelPoint = `${string},${string},${string}`;

export type Grid = Map<GridPoint, Color>;
type VoxelGrid = Map<VoxelPoint, boolean>;
interface FormState {
	xz: FormItemState<Grid>;
	xy: FormItemState<Grid>;
	yz: FormItemState<Grid>;
	voxels: FormItemState<VoxelGrid>;
	bgxz: Grid;
	bgxy: Grid;
	bgyz: Grid;
	gridSize: FormItemState<GridOptions>;
	zoom: FormItemState<number>;
	msg: FormItemState<string>;
	err: FormItemState<string>;
	repaint: FormItemState<number>;
}

type GridOptions = 16 | 32 | 64 | 128;

interface ProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function GridProvider(props: ProviderProps) {
	const [msg, set_msg] = createSignal<string>("");
	const [err, set_err] = createSignal<string>("");
	const [gridLength, setGridLength] = createSignal<GridOptions>(32);
	const [zoomMultiplier, set_zoomMultiplier] = createSignal(1);
	const [repaint, set_repaint] = createSignal<number>(0); // <--- Add this line
	const [xz, set_xz] = createSignal<Map<GridPoint, Color>>(
		new Map<GridPoint, Color>()
	);
	const [xy, set_xy] = createSignal<Map<GridPoint, Color>>(
		new Map<GridPoint, Color>()
	);
	const [yz, set_yz] = createSignal<Map<GridPoint, Color>>(
		new Map<GridPoint, Color>()
	);
	const [voxels, set_voxels] = createSignal<VoxelGrid>(
		new Map<VoxelPoint, boolean>()
	);
	const bgGrid = new Map<GridPoint, Color>();
	const bgxz = initGrid();
	const bgxy = bgxz;
	const bgyz = bgxy;

	function initGrid() {
		const lightGray: string = "#cccccc";
		const darkGray: string = "#999999";
		const mid = gridLength() / 2;
		for (let x = 0; x < gridLength(); x++) {
			for (let y = 0; y < gridLength(); y++) {
				// Large quadrant checkerboard
				const isLargeLight = (x < mid && y < mid) || (x >= mid && y >= mid);
				const largeColor = isLargeLight ? lightGray : darkGray;

				// Small 2x2 checkerboard overlay
				const isSmallLight = (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0;
				const smallColor: Color = isSmallLight
					? chroma(largeColor).brighten(0.2)
					: chroma(largeColor).darken(0.2);

				// Blend: average the two colors (simple approach: pick one, or use smallColor with opacity)
				// For simplicity, use smallColor over largeColor with 50% opacity (CSS can do this, but for hex, just pick smallColor)
				bgGrid.set(`${x},${y}`, smallColor);
			}
		}
		return bgGrid;
	}

	function computeVoxelGrid(
		xy: Map<string, Color>,
		xz: Map<string, Color>,
		yz: Map<string, Color>,
		gridSize: number
	): VoxelGrid {
		const voxels = new Map<VoxelPoint, boolean>();
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				for (let z = 0; z < gridSize; z++) {
					const xyColor = xy.get(`${x},${y}`);
					const xzColor = xz.get(`${x},${z}`);
					const yzColor = yz.get(`${y},${z}`);
					if (xyColor && xzColor && yzColor) {
						// You can choose which color to use, or blend them
						voxels.set(`${x},${y},${z}`, true);
					}
				}
			}
		}
		return voxels;
	}
	
	// Update voxels whenever any grid changes
	createEffect(() => {
		// Get the current state of all grids
		const xyGrid = xy();
		const xzGrid = xz();
		const yzGrid = yz();
		const size = gridLength();
		
		// Compute new voxel grid
		const newVoxels = computeVoxelGrid(xyGrid, xzGrid, yzGrid, size);
		
		// Update voxel state
		set_voxels(newVoxels);
	});

	const grid_state = {
		xz: {
			get: xz,
			set: set_xz,
		},
		xy: {
			get: xy,
			set: set_xy,
		},
		yz: {
			get: yz,
			set: set_yz,
		},
		voxels: {
			get: voxels,
			set: set_voxels,
		},
		bgxz,
		bgxy,
		bgyz,
		gridSize: {
			get: gridLength,
			set: setGridLength,
		},
		zoom: {
			get: zoomMultiplier,
			set: set_zoomMultiplier,
		},
		msg: {
			get: msg,
			set: set_msg,
		},
		err: {
			get: err,
			set: set_err,
		},
		repaint: {
			get: repaint,
			set: set_repaint,
		},
	};

	return (
		<GridContext.Provider
			value={{
				grid_state,
				initGrid,
			}}
		>
			{props.children}
		</GridContext.Provider>
	);
}

export const useGrid = () => {
	const context = useContext(GridContext);
	if (!context) {
		throw new Error("useGrid must be used within an GridProvider");
	}
	return context;
};
