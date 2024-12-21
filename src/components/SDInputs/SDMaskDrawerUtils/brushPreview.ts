"use client";

export function brushPreview(canvas: any, canvasBrush: any, zoomLevel: number) {
  canvasBrush.style.width = `${100 * zoomLevel}px`;
  canvasBrush.style.height = `${100 * zoomLevel}px`;
  // Create a circle that will follow the mouse cursor
  //  var brushCircle = new fabric.Circle({
  //   radius: canvas.freeDrawingBrush.width / 2,
  //   fill: "red",
  //   stroke: 'black', // Color of the stroke
  //   strokeWidth: 3, // Width of the stroke
  //   strokeDashArray: [5, 10], // Pattern of dashes and gaps
  //   originX: 'center',
  //   originY: 'center',
  //   left: -10, // Start off canvas
  //   top: -100,
  //   selectable: false,
  //   evented: false, // The circle should not interfere with canvas events
  // });
  // canvas.add(brushCircle);

  // Update the circle's position on mouse move
  // canvas.on('mouse:move', (opt:any) => {
  //   var pointer = canvas.getPointer(opt.e);
  // console.log(pointer)
  // canvasBrush.style.left = `${pointer.x}px`
  // canvasBrush.style.top = `${pointer.y}px`
  // brushCircle.set({ left: pointer.x, top: pointer.y });
  // canvas.renderAll();
  // });

  canvas.on("mouse:wheel", (opt: any) => {
    var delta = opt.e.deltaY < 0 ? 10 : -10;
    var newWidth = canvas.freeDrawingBrush.width + delta; // Increase or decrease brush size
    newWidth = Math.max(1, Math.min(1000, newWidth)); // Constrain newWidth to be between 1 and 100

    canvas.freeDrawingBrush.width = newWidth;
    canvasBrush.style.width = `${newWidth * zoomLevel}px`;
    canvasBrush.style.height = `${newWidth * zoomLevel}px`;

    opt.e.preventDefault(); // Prevent the page from scrolling
    opt.e.stopPropagation();
  });
}
