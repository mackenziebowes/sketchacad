import { createEffect, onMount, onCleanup } from "solid-js";
import { useGrid, type VoxelPoint } from "./Context";
import { useKey } from "./hooks/KeyContext";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import chroma from "chroma-js";

interface VoxelProps {
  size?: number;
  backgroundColor?: string;
}

export function Voxel(props: VoxelProps) {
  const { grid_state } = useGrid();
  const { keyState } = useKey();
  
  // Default props
  const size = props.size || 400;
  const backgroundColor = props.backgroundColor || "#f0f0f0";
  
  // References for Three.js
  let containerRef: HTMLDivElement | undefined;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;
  let voxelGroup: THREE.Group;
  
  // Store current voxel meshes for cleanup
  const voxelMeshes: THREE.Mesh[] = [];
  
  // Initialize Three.js scene
  function initThree() {
    if (!containerRef) return;
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    
    // Camera
    const aspect = containerRef.clientWidth / containerRef.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.clientWidth, containerRef.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.appendChild(renderer.domElement);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 30);
    scene.add(directionalLight);
    
    // Group for voxels
    voxelGroup = new THREE.Group();
    scene.add(voxelGroup);
    
    // Axes helper
    const axesHelper = new THREE.AxesHelper(grid_state.gridSize.get() * 0.6);
    scene.add(axesHelper);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(
      grid_state.gridSize.get(), 
      grid_state.gridSize.get(),
      0x888888,
      0x444444
    );
    scene.add(gridHelper);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    
    // Handle resize
    window.addEventListener('resize', handleResize);
    
    // Space key to toggle controls
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        controls.enabled = !controls.enabled;
      }
      if (e.key.toLowerCase() === 'r') {
        // Reset camera
        camera.position.set(50, 50, 50);
        camera.lookAt(0, 0, 0);
        controls.reset();
      }
    });
  }
  
  function handleResize() {
    if (!containerRef || !camera || !renderer) return;
    
    camera.aspect = containerRef.clientWidth / containerRef.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerRef.clientWidth, containerRef.clientHeight);
  }
  
  // Blend colors from the different views
  function blendVoxelColors(x: number, y: number, z: number) {
    const xyColor = grid_state.xy.get().get(`${x},${y}`);
    const xzColor = grid_state.xz.get().get(`${x},${z}`);
    const yzColor = grid_state.yz.get().get(`${y},${z}`);
    
    // If we have colors from all three planes, blend them
    if (xyColor && xzColor && yzColor) {
      // Average the colors
      return chroma.mix(
        chroma.mix(xyColor, xzColor, 0.5),
        yzColor,
        0.5
      ).hex();
    }
    
    // If we have some colors but not all, use the available ones
    if (xyColor && xzColor) return chroma.mix(xyColor, xzColor, 0.5).hex();
    if (xyColor && yzColor) return chroma.mix(xyColor, yzColor, 0.5).hex();
    if (xzColor && yzColor) return chroma.mix(xzColor, yzColor, 0.5).hex();
    
    // If we have only one color, use it
    if (xyColor) return xyColor.hex();
    if (xzColor) return xzColor.hex();
    if (yzColor) return yzColor.hex();
    
    // Default (shouldn't happen with the intersection logic)
    return "#555555";
  }
  
  // Update the voxels in the scene
  function updateVoxels() {
    // Clear existing voxels
    voxelMeshes.forEach(mesh => {
      voxelGroup.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    voxelMeshes.length = 0;
    
    const voxels = grid_state.voxels.get();
    const gridSize = grid_state.gridSize.get();
    
    // Create a single geometry for better performance
    const boxGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    
    // Create a voxel for each point in the voxel grid
    for (const key of voxels.keys()) {
      const [x, y, z] = key.split(',').map(Number);
      
      // Calculate position in the scene
      const xPos = x - gridSize / 2;
      const yPos = y - gridSize / 2;
      const zPos = z - gridSize / 2;
      
      // Get color for the voxel
      const color = blendVoxelColors(x, y, z);
      const material = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.4,
        metalness: 0.2
      });
      
      // Create the mesh
      const mesh = new THREE.Mesh(boxGeometry, material);
      mesh.position.set(xPos, yPos, zPos);
      
      // Add to the scene
      voxelGroup.add(mesh);
      voxelMeshes.push(mesh);
    }
  }
  
  // Export to OBJ format
  function exportToOBJ() {
    // TODO: Implement OBJ export
    console.log("OBJ export not yet implemented");
  }
  
  // Setup
  onMount(() => {
    initThree();
    updateVoxels();
    
    // Cleanup
    onCleanup(() => {
      if (renderer) {
        renderer.dispose();
        containerRef?.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of all Three.js objects
      voxelMeshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
    });
  });
  
  // Update when voxels change
  createEffect(() => {
    const voxels = grid_state.voxels.get();
    // We need to access the voxels to trigger the effect
    if (voxels && scene) {
      updateVoxels();
    }
  });
  
  // Update when grid size changes
  createEffect(() => {
    const gridSize = grid_state.gridSize.get();
    if (scene) {
      // Update helpers
      scene.remove(scene.children.find(child => child instanceof THREE.GridHelper)!);
      const gridHelper = new THREE.GridHelper(
        gridSize,
        gridSize,
        0x888888,
        0x444444
      );
      scene.add(gridHelper);
      
      // Update voxels
      updateVoxels();
    }
  });

  return (
    <div>
      <div 
        ref={containerRef} 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          margin: "0 auto",
          "border-radius": "8px",
          overflow: "hidden"
        }}
      />
      <div style={{
        display: "flex",
        "justify-content": "center",
        gap: "16px",
        "margin-top": "16px"
      }}>
        <button 
          onClick={() => exportToOBJ()}
          style={{
            padding: "8px 16px",
            "border-radius": "4px",
            background: "#2196F3",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Export OBJ (Coming Soon)
        </button>
        <button 
          onClick={() => {
            if (controls) controls.reset();
            if (camera) {
              camera.position.set(50, 50, 50);
              camera.lookAt(0, 0, 0);
            }
          }}
          style={{
            padding: "8px 16px",
            "border-radius": "4px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}