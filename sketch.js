let objects = [];
let maxObjects = 20; // Maximum number of objects in the trail
let distance = 50; // Distance between objects in the trail
let inputBox; // Input box for user content
let inputText = 'BOLD FUTURE'; // Default text
let trailLengthSlider, textColorPicker, bgColorPicker, paddingSlider, lineHeightSlider;
let backgroundInput; // File input for background image

function setup() {
  createCanvas(windowWidth, windowHeight);

  inputBox = createInput('BOLD FUTURE');
  inputBox.position(20, 20); // Position the input box
  inputBox.size(200, 30);
  inputBox.input(updateInputText);

  // Add Trail Length Slider
  createDiv('Trail Length').position(20, 60).style('color', '#FFFFFF');
  trailLengthSlider = createSlider(5, 50, maxObjects, 1);
  trailLengthSlider.position(20, 80);
  trailLengthSlider.style('width', '200px');

  // Add Text Color Picker
  createDiv('Text Color').position(20, 120).style('color', '#FFFFFF');
  textColorPicker = createColorPicker('#FFFFFF'); // Default: white text
  textColorPicker.position(20, 140);

  // Add Background Color Picker
  createDiv('Background Color').position(20, 180).style('color', '#FFFFFF');
  bgColorPicker = createColorPicker('#2C2C2C'); // Default: dark background
  bgColorPicker.position(20, 200);

  // Add Padding Slider
  createDiv('Padding').position(20, 240).style('color', '#FFFFFF');
  paddingSlider = createSlider(0, 50, 0, 1); // Default: 0px
  paddingSlider.position(20, 260);
  paddingSlider.style('width', '200px');

  // Add Line Height Slider
  createDiv('Line Height (%)').position(20, 300).style('color', '#FFFFFF');
  lineHeightSlider = createSlider(50, 200, 60, 1); // Default: 60%
  lineHeightSlider.position(20, 320);
  lineHeightSlider.style('width', '200px');

  // Add Background Image Input
  createDiv('Background Image').position(20, 360).style('color', '#FFFFFF');
  backgroundInput = createFileInput(handleBackgroundImage);
  backgroundInput.position(20, 380);
}

function draw() {

  // Update the maximum trail length based on slider
  maxObjects = trailLengthSlider.value();

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
    obj.update(
      targetX,
      targetY,
      offsetFactor,
      i,
      inputText,
      textColorPicker.color(),
      bgColorPicker.color(),
      paddingSlider.value(),
      lineHeightSlider.value()
    );
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

  update(targetX, targetY, speedFactor, index, textContent, textColor, bgColor, padding, lineHeight) {
    let distToTarget = dist(this.x, this.y, targetX, targetY);
    if (distToTarget > distance) {
      this.x = lerp(this.x, targetX, 0.1); // Smooth motion towards the target
      this.y = lerp(this.y, targetY, 0.1);
    }
    this.htmlElement.position(this.x, this.y);
    this.htmlElement.html(textContent);

    let fontSize = map(index, 0, maxObjects - 1, 150, 30);
    this.htmlElement.style('font-size', `${fontSize}px`);
    this.htmlElement.style('color', textColor);
    this.htmlElement.style('background-color', bgColor);
    this.htmlElement.style('padding', `${padding}px`);
    this.htmlElement.style('line-height', `${lineHeight}%`);
  }

  remove() {
    this.htmlElement.remove();
  }
}

function updateInputText() {
  inputText = inputBox.value(); // Store the value of the input box
}

// Handle background image upload
function handleBackgroundImage(file) {
  if (file.type === 'image') {
    let imgURL = URL.createObjectURL(file.file);
    document.body.style.backgroundImage = `url(${imgURL})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  }
}