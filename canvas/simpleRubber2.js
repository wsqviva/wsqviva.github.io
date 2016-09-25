'use strict';

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

context.strokeStyle = 'yellow';
context.lineWidth = 1.0;

var rect = canvas.getBoundingClientRect();
var mousedown = {};
var rubberbandRectangle = {};
var imageData = null;
var imageDataCopy = null;
var min = Math.min;
var abs = Math.abs;
var round = Math.round;
var dragging = false;

function on(eventName, fn) {
  canvas.addEventListener(eventName, fn, false);
}

function clientXToCanvas(clientX) {
  return clientX - rect.left;
}

function clientYToCanvas(clientY) {
  return clientY - rect.top;
}

function rubberbanStart(x, y) {
  mousedown.x = x;
  mousedown.y = y;

  imageDataCopy = context.createImageData(canvasWidth, canvasHeight);

  for (var i = 0; i < 3; i++) {
    imageDataCopy.data[i] = imageData.data[i];
  }

  for (i = 3; i < imageData.data.length - 4; i+=4) {
    imageDataCopy.data[i] = imageData.data[i] / 2;
    imageDataCopy.data[i + 1] = imageData.data[i + 1];
    imageDataCopy.data[i + 2] = imageData.data[i + 2];
    imageDataCopy.data[i + 3] = imageData.data[i + 3];
  }

  dragging = true;
}

function rubberbandStretch(x, y) {
  if (rubberbandRectangle.width > 2 * context.lineWidth && rubberbandRectangle.height > 2 * context.lineWidth) {
      context.putImageData(imageData, 0, 0);
      context.putImageData(imageDataCopy, 0, 0, rubberbandRectangle.left - 0.5 * context.lineWidth, rubberbandRectangle.top - 0.5 * context.lineWidth, rubberbandRectangle.width + context.lineWidth, rubberbandRectangle.height + context.lineWidth);
  }

  rubberbandRectangle.left = min(x, mousedown.x);
  rubberbandRectangle.top = min(y, mousedown.y);
  rubberbandRectangle.width = abs(x - mousedown.x);
  rubberbandRectangle.height = abs(y - mousedown.y);

  if (rubberbandRectangle.width > 2 * context.lineWidth && rubberbandRectangle.height > 2 * context.lineWidth) {
    context.strokeRect(rubberbandRectangle.left + 0.5 * context.lineWidth, rubberbandRectangle.top + 0.5 * context.lineWidth, rubberbandRectangle.width - context.lineWidth, rubberbandRectangle.height - context.lineWidth);
  }
}

function rubberbandEnd() {
  dragging = false;
  imageDataCopy = null;
}

var a = null;
var time = +(new Date());

function main() {
  context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
  on('mousedown', function(event) {
    var canvasX = clientXToCanvas(event.clientX);
    var canvasY = clientYToCanvas(event.clientY);
    event.preventDefault();
    rubberbanStart(canvasX, canvasY);
  });

  on('mousemove', function(event) {
    if (dragging) {
      var canvasX = clientXToCanvas(event.clientX);
      var canvasY = clientYToCanvas(event.clientY);
      rubberbandStretch(canvasX, canvasY);
    }
  });

  on('mouseup', function() {
    rubberbandEnd();
  });

  document.addEventListener('mouseup', function() {
    rubberbandEnd();
  }, false);
}

var image = new Image();
image.onload = main;
image.src = '1.jpg';



