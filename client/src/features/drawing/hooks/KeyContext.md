# KeyContext Goals

Sketchacad offers a variety of tools for users - currently, in this early version, we have:
Pencil => Click and drag to fill pixels with the current color
Eraser => Click and drag to delete pixels
Line => Click a start and endpoint to get straight lines
Color => Users can change the color they're drawing with

We need some kind of UI for changing these tools.

My thinking is: SolidJS Portals!

We need a context for:
Controlling the display of a "tool panel" modal that contains buttons that consume the ToolContext to give folks the option to swap tools or update their colour choice.

This behaviour of opening and closing the tool panel, on a laptop, should be controlled by a keybind rather than a button - something that doesn't typically collide with other keybinds. Cmd+K is common.
