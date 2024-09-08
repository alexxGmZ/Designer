/**
 * Retrieves the current pointer coordinates from the DOM elements showing the canvas
 * pointer positions.
 *
 * @returns {{pointerX: number, pointerY: number}} - The current pointer coordinates
 * as numbers with one decimal precision.
 */
function getPointerCoordinates() {
   console.log(`getPointerCoordinates()`);

   const pointerXElement = document.getElementById("canvasPntrCoordsX").textContent;
   const pointerYElement = document.getElementById("canvasPntrCoordsY").textContent;
   const pointerX = parseFloat(pointerXElement).toFixed(1);
   const pointerY = parseFloat(pointerYElement).toFixed(1);

   return { pointerX, pointerY };
}

/**
 * Toggles the context menu visibility on canvas mouse events.
 *
 * @param {fabric.Canvas} canvas - The Fabric.js canvas instance to monitor for mouse
 * events.
 */
function mouseContextMenu(canvas) {
   if (!canvas) return;
   console.log(`mouseContextMenu(${canvas})`);

   canvas.on("mouse:up", (event) => {
      console.log("canvas mouse:up event");
      const selectedObjects = canvas.getActiveObjects();
      const isLeftClick = event.button === 1;
      const isRightClick = event.button === 3;

      // if canvas is clicked
      if (selectedObjects.length === 0) {
         if (isLeftClick) {
            console.log("left click");
            toggleContextMenu(canvas, "hide");
         }

         // show context menu when right-clicked in any place of canvas
         if (isRightClick) {
            console.log("right click");
            toggleContextMenu(canvas, "show");
         }
      }

      // if object/s are clieked
      else {
         selectedObjects.forEach((object) => {
            if (isLeftClick)
               console.log(`Left clicked object - Type: ${object.type}`);

            if (isRightClick)
               console.log(`Right clicked object - Type: ${object.type}`);
         });

         if (isRightClick) toggleContextMenu(canvas, "show");
      }
   });

   canvas.on("mouse:down", () => {
      console.log("canvas mouse:down event");
      // hide context menu when the mouse is pressed down
      toggleContextMenu(canvas, "hide");
   });
}

/**
 * Controls the display of the context menu on the canvas based on user interactions.
 *
 * @param {fabric.Canvas} canvas - The Fabric.js canvas instance where the context menu
 * is shown or hidden.
 * @param {string} displayType - Specifies whether to "show" or "hide" the context
 * menu.
 */
function toggleContextMenu(canvas, displayType) {
   console.log(`toggleContextMenu(${canvas}, ${displayType})`);
   const contextMenu = document.getElementById("contextMenu");

   if (displayType == "hide") {
      contextMenu.style.display = "none";
   }

   else if (displayType == "show") {
      const { pointerX, pointerY } = getPointerCoordinates();
      const canvasZoom = document.getElementById("scaleRangeInput").value;

      contextMenu.style.display = "block";
      contextMenu.style.left = ((pointerX * canvasZoom) + 70) + 'px';
      contextMenu.style.top = ((pointerY * canvasZoom) + 80) + 'px';

      const layerBringToFront = document.getElementById("layerBringToFront");
      const layerBringForward = document.getElementById("layerBringForward");
      const layerSendBackward = document.getElementById("layerSendBackward");
      const layerSendToBack = document.getElementById("layerSendToBack");
      const objectProperties = document.getElementById("objectProperties");

      layerBringToFront.style.display = "none";
      layerBringForward.style.display = "none";
      layerSendBackward.style.display = "none";
      layerSendToBack.style.display = "none";
      objectProperties.style.display = "none";

      const selectedObjects = canvas.getActiveObjects();

      if (selectedObjects.length > 0) {
         layerBringToFront.style.display = "flex";
         layerBringForward.style.display = "flex";
         layerSendBackward.style.display = "flex";
         layerSendToBack.style.display = "flex";
      }

      // show context menu properties if there's only one object selected
      if (selectedObjects.length == 1) {
         objectProperties.style.display = "flex";
      }
   }
}

module.exports = {
   getPointerCoordinates,
   mouseContextMenu,
   toggleContextMenu
}
