const dragBtn = document.getElementById("dragBtn");
const div2 = document.getElementById("div2");

// Step 1: When drag starts
dragBtn.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", e.target.id);
});

// Step 2: Allow drop on div2
div2.addEventListener("dragover", (e) => {
  e.preventDefault(); // Must prevent default to allow drop
});

// Step 3: Handle drop — make a copy of the dragged button
div2.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedElem = document.getElementById(draggedId);

  // Clone the element
  const clone = draggedElem.cloneNode(true);
  clone.id = "clone-" + Date.now(); // Give unique ID
  div2.appendChild(clone);
});
