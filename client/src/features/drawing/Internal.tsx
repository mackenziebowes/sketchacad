import { Grid } from "./Grid";
import Voxel from "./Voxel";
import { useGrid } from "./Context";
import { onMount, createSignal } from "solid-js";
import Stack from "~/devano/atoms/layout/Stack";
import { Heading } from "~/devano/atoms/layout/Heading";

export default function Internal() {
	const { initGrid } = useGrid();
	const [showVoxels, setShowVoxels] = createSignal(true);

	onMount(() => {
		initGrid();
	});

	return (
		<Stack direction="col">
			<div
				style={{
					display: "grid",
					"grid-template-columns": "1fr 1fr",
					"grid-template-rows": "1fr 1fr",
					gap: "32px",
					"box-sizing": "border-box",
					"min-width": 0,
					"min-height": 0,
				}}
			>
				<div
					style={{
						"grid-column": "1",
						"grid-row": "1",
						width: "320px",
						height: "100%",
						"min-width": 0,
						"min-height": 0,
						"aspect-ratio": "1 / 1",
					}}
				>
					<Heading as="h4">XY</Heading>
					<Grid gridKey="xy" />
				</div>
				<div
					style={{
						"grid-column": 2,
						"grid-row": 1,
						width: "100%",
						height: "100%",
						"min-width": 0,
						"min-height": 0,
						"aspect-ratio": "1 / 1",
					}}
				>
					<Heading as="h4">3D</Heading>
					<Voxel />
				</div>
				<div
					style={{
						"grid-column": "2",
						"grid-row": "2",
						width: "100%",
						height: "100%",
						"min-width": 0,
						"min-height": 0,
						"aspect-ratio": "1 / 1",
					}}
				>
					<Heading as="h4">YZ</Heading>
					<Grid gridKey="yz" />
				</div>
				<div
					style={{
						"grid-column": "1",
						"grid-row": "2",
						width: "100%",
						height: "100%",
						"min-width": 0,
						"min-height": 0,
						"aspect-ratio": "1 / 1",
					}}
				>
					<Heading as="h4">XZ</Heading>
					<Grid gridKey="xz" />
				</div>
			</div>

			<div
				style={{
					display: "flex",
					"flex-direction": "column",
					"justify-content": "center",
					"align-items": "center",
					"margin-top": "320px",
				}}
			>
				<div
					style={{
						"text-align": "center",
						"font-weight": "bold",
						"margin-bottom": "2px",
					}}
				>
					Controls
				</div>
				<div style={{ "text-align": "left", "max-width": "300px" }}>
					<p>
						<strong>Drawing:</strong> Click and drag on any grid
					</p>
					<p>
						<strong>Keyboard Shortcuts:</strong>
					</p>
					<ul style={{ "padding-left": "20px" }}>
						<li>P: Pencil tool</li>
						<li>E: Eraser tool</li>
						<li>R: Rectangle tool</li>
						<li>L: Line tool</li>
						<li>Ctrl+Z: Undo</li>
						<li>Ctrl+Shift+Z: Redo</li>
					</ul>
				</div>
			</div>
		</Stack>
	);
}
