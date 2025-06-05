export type GridOptions = 16 | 32 | 64 | 128;

export type GridSelection = "xz" | "xy" | "yz";

export type Pixel = {
	x: number;
	y: number;
};

export interface KeyModifiers {
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	meta: boolean;
}

export interface DrawArgs {
	grid: GridSelection;
	point: Pixel;
	modifiers?: KeyModifiers;
}
