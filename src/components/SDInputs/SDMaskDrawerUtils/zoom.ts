// WIP: Zoom is something difficult because is hard to track the position of the elements based in the zoom ratio (my thoughts).
// Even Krea.ai and Comfyui doesn't have that feature, but could be interesting for the future

let zoomInProgress = { x: 0, y: 0 };
export function zoom(canvas: any, minZoom: number) {
  canvas.on("mouse:wheel", (opt: any) => {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    zoom = Math.max(minZoom, Math.min(20, zoom)); // Constrain zoom range
    console.log(zoomInProgress);
    console.log(zoom, minZoom);
    // point to 0,0 if the zoom out is at the maximum value
    if (zoomInProgress.x === 0 && zoomInProgress.y === 0) {
      console.log("hi");
      if (zoom > minZoom) {
        zoomInProgress = { x: opt.e.offsetX, y: opt.e.offsetY };
      } else {
        zoomInProgress = { x: 0, y: 0 };
      }
    }

    // const zoomXPoint = zoom === minZoom ? 0:opt.e.offsetX
    // const zoomYPoint = zoom === minZoom ?0: opt.e.offsetY
    canvas.zoomToPoint({ x: zoomInProgress.x, y: zoomInProgress.y }, zoom);

    opt.e.preventDefault();
    opt.e.stopPropagation();
    // adjustViewportAfterZoom(canvas)

    // Adjust the viewport to keep the canvas's content within bounds
    // This is a simplified bounds checking and adjustment
    // var vpt = this.viewportTransform;
    if (zoom < 400 / 1000) {
      // Your logic for zoom < 0.4, if needed
    } else {
      // Ensure the content stays within the visible area without overriding zoomToPoint
      // this.requestRenderAll(); // Request a re-render if needed
    }
  });
}

function adjustViewportAfterZoom(canvas: any) {
  // Assuming there is one main image on the canvas you want to keep in view
  const obj = canvas.getObjects()[0]; // Get your image object; adjust this line as needed

  // Get bounding rect of the object
  const objBoundingRect = obj.getBoundingRect();

  const zoom = canvas.getZoom();
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Calculate the bounds of the zoomed image
  const zoomedWidth = objBoundingRect.width * zoom;
  const zoomedHeight = objBoundingRect.height * zoom;

  let x = canvas.viewportTransform[4];
  let y = canvas.viewportTransform[5];

  // Adjust X position
  if (zoomedWidth < canvasWidth || x > 0) {
    x = (canvasWidth - zoomedWidth) / 2;
  } else if (x + zoomedWidth < canvasWidth) {
    x = canvasWidth - zoomedWidth;
  }

  // Adjust Y position
  if (zoomedHeight < canvasHeight || y > 0) {
    y = (canvasHeight - zoomedHeight) / 2;
  } else if (y + zoomedHeight < canvasHeight) {
    y = canvasHeight - zoomedHeight;
  }

  // Apply the adjusted viewport transform
  canvas.setViewportTransform([zoom, 0, 0, zoom, x, y]);
  canvas.requestRenderAll();
}
