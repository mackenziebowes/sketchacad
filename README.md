# SketchAcad

A modern voxel-based 3D modeling tool that uses orthographic projections to create 3D models from 2D drawings.

## Overview

SketchAcad is a web-based 3D modeling application that allows users to create 3D models by drawing on 2D orthographic projections. It uses the concept of "constructive solid geometry" by combining three orthographic views (top, front, and side) to create a 3D voxel model.

The application is built with:

- SolidJS for reactive UI
- Three.js for 3D rendering
- TypeScript for type safety
- CSS for styling

## Features

- **Multi-view Drawing**: Draw on three orthographic views (XY, XZ, YZ)
- **Real-time 3D Preview**: See your 3D model update in real-time as you draw
- **Interactive Tools**:
  - Pencil: Free-form drawing
  - Eraser: Remove pixels
  - Rectangle: Draw filled rectangles
  - Line: Draw straight lines
- **Keyboard Shortcuts**:
  - P: Pencil tool
  - E: Eraser tool
  - R: Rectangle tool
  - L: Line tool
  - Shift + Drag: Draw straight lines (with Pencil tool)
  - Ctrl+Z: Undo
  - Ctrl+Shift+Z: Redo
- **3D Model Controls**:
  - Mouse drag to orbit
  - Scroll to zoom
  - Shift + Mouse drag to pan
- **Advanced Features**:
  - Color blending modes (implemented, but no color picker lol)
  - Undo/redo history
  - Adjustable grid size (implemented, but no grid change tool)

## Upcoming Features

- Color picker for selecting drawing colors
- Export to .OBJ file format
- More drawing tools (ellipse, arc, fill)
- Layer support
- Import/export project files

## Installation

```bash
# Clone the repository
git clone https://github.com/mackenziebowes/sketchacad.git

# Navigate to the client directory
cd sketchacad/client

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Full-stack ready

This repository contains two other folders - Server and Prisma - that are preconfigured for you to attach a PostgresDB for Authenticating and Authorizing users. Feel free to use that framework to extend Sketchacad into a full SaaS with your own changes!

## Usage

1. **Drawing**: Click and drag on any of the three grid views to draw.
2. **Tools**: Use keyboard shortcuts.
3. **3D View**: The 3D model updates in real-time as you draw. Drag to rotate, use spacebar to toggle auto-rotation.
4. **Creating 3D Objects**: A voxel is created when a point exists in all three orthographic views.

## How It Works

SketchAcad creates 3D models by intersecting three 2D orthographic views:

- **Top View (XY)**: Shows the top-down view of your model
- **Front View (XZ)**: Shows the front view of your model
- **Side View (YZ)**: Shows the side view of your model

A voxel is created in 3D space when a point exists in all three views. This approach is inspired by traditional drafting techniques used in mechanical engineering and architecture.

## Architecture

The application uses a context-based architecture:

- **GridContext**: Manages the state of all three orthographic grids
- **ToolContext**: Manages the current drawing tool and its settings
- **KeyContext**: Handles keyboard interactions and shortcuts
- **DrawContext**: Provides drawing functionality across the application

These contexts are used by various components:

- **Grid**: Renders a 2D grid and handles drawing interactions
- **Voxel**: Renders the 3D model using Three.js
- **KeyInputs**: Manages keyboard shortcuts and history
- **Controller**: Orchestrates all components

## Development

The project is structured for easy development and extension:

```
client/
├── src/
│   ├── features/
│   │   ├── drawing/         # Main application code
│   │   │   ├── Context.tsx  # Grid state management
│   │   │   ├── ToolContext.tsx # Tool state management
│   │   │   ├── hooks/
│   │   │   │   ├── KeyContext.tsx # Keyboard handling
│   │   │   │   ├── DrawContext.tsx # Drawing logic
│   │   │   │   ├── types.ts       # Shared types
│   │   │   ├── Grid.tsx     # 2D grid component
│   │   │   ├── Voxel.tsx    # 3D renderer (Three.js)
│   │   │   ├── KeyInputs.tsx # Keyboard interaction
│   │   │   ├── Controller.tsx # Main controller
│   ├── devano/             # UI component library
│   ├── routes/             # Application routes
```

### Adding New Features

To add new features to SketchAcad, follow these steps:

1. **New Drawing Tools**: Extend the `Tools` enum in ToolContext.tsx and update the drawing logic in DrawContext.tsx.
2. **UI Components**: Make a mess, do whatever. As soon as you download, it's your code.
3. **3D Functionality**: Extend the Voxel.tsx component to support new rendering features.

### TODOs

- [ ] Implement color picker
- [ ] Add .OBJ export functionality
- [ ] Create more drawing tools
- [ ] Add layer support
- [ ] Improve performance for larger models

## Technical Details

### Three.js Integration

The 3D renderer uses Three.js for rendering the voxel model. Key components:

1. Scene setup with proper lighting
2. BoxGeometry for voxels
3. OrbitControls for camera manipulation
4. Color blending from orthographic views

### Voxel Generation

Voxels are generated using the intersection of three 2D grids:

```typescript
// A point exists in 3D space if it exists in all three 2D views
if (xyColor && xzColor && yzColor) {
	voxels.set(`${x},${y},${z}`, true);
}
```

### History Management

The application includes an undo/redo system that tracks changes to the grid state:

```typescript
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
```

## Credits

SketchAcad was built with:

- [SolidJS](https://www.solidjs.com/) - A declarative, efficient and flexible JavaScript library for building user interfaces
- [Three.js](https://threejs.org/) - JavaScript 3D library
- [Chroma.js](https://gka.github.io/chroma.js/) - A small-ish zero-dependency JavaScript library for all kinds of color manipulations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
