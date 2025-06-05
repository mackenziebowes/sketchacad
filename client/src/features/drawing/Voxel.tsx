import { createSignal, JSX, onMount, createEffect } from "solid-js";
import { useGrid, type VoxelPoint } from "./Context";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import chroma, { type Color } from "chroma-js";
interface VoxelProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export default function Voxel(props: VoxelProps) {
	const { grid_state } = useGrid();
	let mountRef: HTMLDivElement | undefined;

	// These are not signals, just refs
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;

	onMount(() => {
		const gridSize = grid_state.gridSize.get();
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);
		const center = gridSize / 2;
		camera = new THREE.PerspectiveCamera(
			75,
			mountRef!.clientWidth / mountRef!.clientHeight,
			0.1,
			1000
		);
		camera.position.set(center + 10, center + 10, center + 10);
		camera.lookAt(-center, -center, -center);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(mountRef!.clientWidth, mountRef!.clientHeight);
		mountRef!.appendChild(renderer.domElement);

		controls = new OrbitControls(camera, renderer.domElement);

		animate();
	});

	function animate() {
		requestAnimationFrame(animate);
		controls?.update();
		renderer?.render(scene, camera);
	}

	function ColorToColor(color: Color | undefined) {
		if (color) {
			return new THREE.Color(color.hex());
		} else {
			return new THREE.Color(chroma("black").hex());
		}
	}

	// Reactively update voxels
	createEffect(() => {
		const voxels = grid_state.voxels.get();
		// Remove previous voxels
		while (scene && scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}

		// Add new voxels
		for (const [key, filled] of voxels) {
			if (!filled) continue;
			const [x, y, z] = key.split(",").map(Number);
			const xzColor = grid_state.xz.get().get(`${x},${z}`);
			const xyColor = grid_state.xy.get().get(`${x},${y}`);
			const yzColor = grid_state.yz.get().get(`${y},${z}`);
			const materials = [
				new THREE.MeshStandardMaterial({ color: ColorToColor(chroma("aqua")) }), // right
				new THREE.MeshStandardMaterial({
					color: ColorToColor(chroma("beige")),
				}), // left
				new THREE.MeshStandardMaterial({
					color: ColorToColor(chroma("blueviolet")),
				}), // top
				new THREE.MeshStandardMaterial({
					color: ColorToColor(chroma("brown")),
				}), // bottom
				new THREE.MeshStandardMaterial({
					color: ColorToColor(chroma("crimson")),
				}), // front
				new THREE.MeshStandardMaterial({ color: ColorToColor(chroma("cyan")) }), // back
			];
			const gridSize = grid_state.gridSize.get();
			const geometry = new THREE.BoxGeometry(1, 1, 1);
			// const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
			const cube = new THREE.Mesh(geometry, materials);
			cube.position.set(x - 32, -z, y - 32); // Try this mapping
			scene.add(cube);
		}
		// Add a light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		const backlight = new THREE.DirectionalLight(0xe3e3e3, 0.5);
		light.position.set(10, 10, 10);
		backlight.position.set(-20, -20, -20);
		scene.add(backlight);
		scene.add(light);
	});

	return (
		<div
			ref={mountRef}
			style={{ width: "100%", height: "100%" }}
		/>
	);
}
