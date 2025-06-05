# Contributing to SketchAcad

Thank you for your interest in contributing to SketchAcad! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/sketchacad.git
   cd sketchacad/client
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

## Project Structure

The SketchAcad client is a SolidJS application structured as follows:

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

## Code Style Guidelines

- Use TypeScript for all new code
- Follow existing file structure and naming conventions
- Use SolidJS best practices for reactive programming
- Add appropriate comments for complex logic
- Ensure proper typing for all functions and variables

## Architecture

SketchAcad uses a context-based architecture:

1. **Contexts**:

   - `GridContext`: Manages the grid state (XY, XZ, YZ, and voxels)
   - `ToolContext`: Manages the current tool and tool settings
   - `KeyContext`: Manages keyboard input and shortcuts
   - `DrawContext`: Provides drawing functionality

2. **Components**:
   - Use context hooks to access shared state
   - Follow the Single Responsibility Principle

## Adding New Features

### New Drawing Tools

1. Add the tool to the `Tools` enum in `ToolContext.tsx`
2. Update the drawing logic in `DrawContext.tsx`
3. Add any UI components needed for the tool
4. Add keyboard shortcuts in `KeyContext.tsx` if needed

### New 3D Features

1. Update the `Voxel.tsx` file to add new Three.js functionality
2. Ensure proper integration with the existing grid data
3. Add UI controls for new 3D features

### UI Components

1. Add new components to the appropriate directory
2. Ensure they integrate with the existing contexts
3. Maintain consistent styling (review devano folder for existing UI)

## Pull Request Process

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes with clear, descriptive commit messages
4. Push your branch and submit a pull request
5. Describe your changes in detail in the pull request

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## License

By contributing to SketchAcad, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

If you have any questions or need help, please open an issue on GitHub.

Thank you for contributing to SketchAcad!
