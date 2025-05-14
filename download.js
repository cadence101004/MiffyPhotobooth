const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");
const colorInput = document.getElementById("frame-color");
const uploadInput = document.getElementById("frame-upload");

let selectedFrame = null;
let capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos") || "[]");

const canvasWidth = 240;
const imageHeight = 160;
const spacing = 10;
const framePadding = 10;
const logoSpace = 80;

finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

function drawCollage() {
  ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Draw frame background if selected
  if (selectedFrame) {
    const bg = new Image();
    bg.src = selectedFrame;
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, finalCanvas.width, finalCanvas.height);
      drawPhotos();
    };
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    drawPhotos();
  }
}

function drawPhotos() {
  capturedPhotos.forEach((photo, i) => {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      const x = framePadding;
      const y = framePadding + i * (imageHeight + spacing);
      ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
    };
  });
}

// Preset frames
colorButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedFrame = btn.dataset.color;
    drawCollage();
  });
});

// Color picker
colorInput.addEventListener("input", () => {
  selectedFrame = null;
  ctx.fillStyle = colorInput.value;
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  drawPhotos();
});

// Upload custom frame
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      selectedFrame = reader.result;
      drawCollage();
    };
    reader.readAsDataURL(file);
  }
});

// Download button
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = finalCanvas.toDataURL("image/png");
  link.download = "photobooth.png";
  link.click();
});

drawCollage();
