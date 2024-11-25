let objects = [];
let maxObjects = 20; // Maximum number of objects in the trail
let distance = 50; // Distance between objects in the trail
let inputBox; // Input box for user content
let inputText = 'BOLD FUTURE'; // Default text


function setup() {
  createCanvas(windowWidth, windowHeight);

  inputBox = createInput('BOLD FUTURE');
  inputBox.position(20, 20); // Position the input box at the top-left of the canvas
  inputBox.size(200, 30); // Set the size of the input box
  inputBox.input(updateInputText); // Call updateInputText when the user types something
}

function draw() {
  background('#2C2C2C');

  // Create a new object at the mouse position
  if (objects.length < maxObjects) {
    let newObject = new TrailObject(mouseX, mouseY, objects.length);
    objects.push(newObject);
  }

  // Update and display all objects
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    let offsetFactor = map(i, 0, objects.length, 0.1, 1);
    let targetX = (i === 0) ? mouseX : objects[i - 1].x;
    let targetY = (i === 0) ? mouseY : objects[i - 1].y;
    obj.update(targetX, targetY, offsetFactor,i, inputText);
  }

  // Remove the oldest object if the trail exceeds maxObjects
  if (objects.length > maxObjects) {
    let removed = objects.shift();
    removed.remove(); // Clean up the HTML element
  }
}

class TrailObject {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.index = index;

    // Create and style the HTML element
    this.htmlElement = createDiv();
    this.htmlElement.class('textBox');
    this.htmlElement.position(this.x, this.y);
  }

  update(targetX, targetY, speedFactor, index, textContent) {

    let distToTarget = dist(this.x, this.y, targetX, targetY);
    if (distToTarget > distance) {
      this.x = lerp(this.x, targetX, 0.1); // Smooth motion towards the target
      this.y = lerp(this.y, targetY, 0.1);
    }
    this.htmlElement.position(this.x, this.y);

    // this.x = lerp(this.x, targetX, speedFactor);
    // this.y = lerp(this.y, targetY, speedFactor);
    this.htmlElement.position(this.x, this.y);
    this.htmlElement.html(textContent);

    let fontSize = map(index, 0, maxObjects - 1, 100, 30);
    this.htmlElement.style('font-size', `${fontSize}px`);

    

  }

  remove() {
    this.htmlElement.remove();
  }
}

function updateInputText() {
  inputText = inputBox.value(); // Store the value of the input box
}