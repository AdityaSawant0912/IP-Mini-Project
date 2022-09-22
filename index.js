const RAD = 50;
const FINAL_RAD = 15;
const EPSILON = 'ɛ';
let old = [-1, -1];
let temp = [0, 0];
let state1;
let enfa;
let cnv;
let wasPressed = false;
let diff = [0, 0];
// let expression = "(((0+1)*.1.0) +((0.0)*.(1.1)*))"
let expression = "a*";


function drawArrow(base, vec) {
push();
  stroke(255);
  strokeWeight(3);
  fill(255);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 10;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function setup() {
  cnv = createCanvas(800, 800);
  cnv.mousePressed(mousePressed1)
  state1 = new State(0, false, false);
  state1.x = 200;
  state1.y = 200;
  expression = InfixToPostfix(expression)
  // expression = InfixToPostfix(expression).split("").reverse().join("");
  console.log(expression);
  enfa = new eNFA(expression)
  enfa.calculateTree();
  console.log(enfa.tree);
  console.log(enfa.connections);
  
}

function mousePressed1() {
  old[0] = mouseX;
  old[1] = mouseY;
  temp = diff;
  wasPressed = true;
}

function draw() {
  background(51);
  if(mouseIsPressed&& wasPressed == true){
    diff = [mouseX - old[0] , mouseY - old[1]];
    diff[0] += temp[0];
    diff[1] += temp[1];
  }else if( !mouseIsPressed && wasPressed == true){
    wasPressed = false
    diff = [mouseX - old[0] + temp[0], mouseY - old[1] + temp[1]]
    temp = [0, 0]
  }
  translate(diff[0], diff[1])

  state1.draw(400, 400);
  // console.log(mousePressed);
  
}
