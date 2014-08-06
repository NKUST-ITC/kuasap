var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
//var width = 800;
//var height = 800;
c.width  = width;
c.height = height;
ctx.fillStyle = "rgba(200, 255, 255, 1)";
ctx.rect(0, 0, width, height);
ctx.fill();
//console.log(height);

var fps = 0, now, lastUpdate = (new Date())*1 - 1, fpsFilter = 60,
    fpsOut = document.getElementById('fps');

var Plant;
var tree;

var mouse = {
        down: false,
        button: 1,
        x: 0,       y: 0,       px: 0,      py: 0
    };
function Params() {
  this.iterations= 4;
  this.theta= 18;
  this.thetaRandomness= 0;
  this.angle= 90;
  this.scale= 4;
  this.scaleRandomness= 0;
  this.constantWidth= false;
  this.slope = 0;
}
function Colors() {
  this.background = "#ffffff";
  this.general = "#000000";
  this.random= false;
  this.alpha= 0.8;
}
function Rules()  {
  this.axiom = 'F';
  this.mainRule = 'FF-[-F+F+F]+[+F-F-F]';
  this.Rule2 = '';
}
var rules = new Rules();
var params = new Params();
var colors = new Colors();
var Plant = '';

function drawLine(x,y, x0,y0, color, width) {
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x0,y0);
  ctx.strokeStyle = color;
  if (params.constantWidth) ctx.lineWidth = 1; else
  ctx.lineWidth = width;
  ctx.stroke();
}
function GetAxiomTree() {
    var Waxiom = rules.axiom;
    var newf = rules.mainRule;
    var newb = 'bb';
    var newx = rules.Rule2;
    var level = params.iterations;
    
    while (level > 0) {        
        var T = '';   
        for (var j=0; j < Waxiom.length; j++) {
            var a = Waxiom[j];
            if (a == 'F'){T += newf;}
            else
              if (a == 'b'){T += newb;}
              else                   
                if (a == 'X'){T += newx;}
                else
                   T += a;
        }
        Waxiom = T;
        level--;
    }
    return Waxiom;
}
function Tree(x, y){   
 

  
    //console.log(n);
}


Tree.prototype.update = function(x, y) {
    var n = Plant.length;
    var stackX = [], stackY = [], stackA = [];    
    var theta = params.theta * Math.PI / 180; 
    var scale = params.scale;
    var angle = - params.angle * Math.PI / 180;    
    var x, y;  
    var x0 = x, y0 = y;  
    var color;
    if (colors.random){
        color = getRandomColor()
    } 
    else {
        var rgb = colors.general;
        //color = "rgba(" + $c.hex2rgb(rgb).R + "," + $c.hex2rgb(rgb).G + "," + $c.hex2rgb(rgb).B + "," + colors.alpha + ")";              
    }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (var j=0; j<Plant.length; j++){   
        //console.log(Plant.length);
        var a = Plant[j];
        if (a == "+"){angle -= theta;}
        if (a == "-"){angle += theta;}
        if (a == "F"){
            x = x0 + Math.cos(angle)*scale;
            y = y0 + Math.sin(angle)*scale;
            var lineWidth = params.scale / Math.sqrt(Math.sqrt(j+5))+1;
            drawLine(x0,y0, x, y, color, lineWidth);           
            x0 = x; y0 = y;
        }        
        if (a == "b"){
            x0 = x0 + Math.cos(angle)*scale;
            y0 = y0 + Math.sin(angle)*scale;
        }
        if (a == "["){
            stackX.push(x0);
            stackY[stackY.length] =  y0;
            stackA[stackA.length] = angle;       
          
        }
        if (a == "]"){
            x0 = stackX.pop();
            y0 = stackY.pop();
            angle = stackA.pop();
        }     
       var randomNum = Math.random() ;
       if (randomNum >0.71)
        {
           scale += randomNum/50 * params.scaleRandomness/100;
        }else
        {
            scale -= randomNum/50 * params.scaleRandomness/100;
        }
        
      var randomNum2 = Math.random();
      if (randomNum2 >0.71)
        {
           angle += randomNum2/10 * params.thetaRandomness/100;
        }else
        {
           angle -= randomNum2/10 *params.thetaRandomness/100;
        }
      angle += params.slope;
      
    }
  
  //params.theta = (canvas.width/2 - mouse.x)/5;
  params.scale = (canvas.height- mouse.y)/50;
  //params.angle = 90 + params.theta;
  params.slope = -(canvas.width/2 - mouse.x)/10000.0;

  if (mouse.down) {
  }
  
  var thisFrameFPS = 1000 / ((now = new Date()) - lastUpdate);
    fps += (thisFrameFPS - fps) / fpsFilter;
    lastUpdate = now;
  //fpsOut.innerHTML = fps.toFixed(1) + "fps";
};

function animate() {
    requestAnimationFrame( animate );
    t0 = Date.now() / 60;
  //var delta = clock.getDelta(),   time = clock.getElapsedTime() * 10;
  
  tree.update(canvas.width/2, canvas.height-10);
  //console.log(t0);
}

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };


tree = new Tree(canvas.width/2, canvas.height-10);
console.log(tree);

animate();
setInterval(function(){
fpsOut.innerHTML = fps.toFixed(1) + "fps"; }, 100);

//=========================== events
window.onload = function() {
  setRules4();  
}  
canvas.onmousedown = function(e) {
        if (e.which == 1) {       
        } else if (e.which == 3) {
            mouse.down = true;          
        }
        e.preventDefault();    }

    canvas.onmouseup = function(e) {
        if (e.which == 3) {
            mouse.down = false;            
        }
        e.preventDefault();    }

    canvas.onmousemove = function(e) {
        var rect = this.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

//=========================== rules setters
function setRules1(){
  rules.axiom = "F";
  rules.mainRule = "FF-[-F+F+F]+[+F-F-F]";
  params.iterations = 4;
  params.theta = 20;
  params.scale = 5;  
  Plant = GetAxiomTree();
}
function setRules2(){
  //rules.axiom = "F[+F+F][-F-F][++F][--F]F";
  rules.axiom = "F[F]+[F]+[F]---[F]-[F]";
  rules.mainRule = "FF[++F][+F][F][-F][--F]";
  params.iterations = 3;
  params.theta = 20;
  params.scale = 10;  
}
function setRules3(){
  rules.axiom = "F++[F]--[F]-[F]-[F]";
  rules.mainRule = "FF++[F[F-F]]--[+F[--F]][---F[-F]]F[-F][F]";
  params.iterations = 3;
  params.theta = 15;
  params.scale = 3;  
}
function setRules4(){
  rules.axiom = "X";
  rules.mainRule = "FF";
  rules.Rule2 = "F[+X]F[-X]+X";  
  params.iterations = 6;
  params.theta = 20;
  params.scale = 1.0;  
  Plant = GetAxiomTree();
}
function setRules5(){
  rules.axiom = "X";
  rules.mainRule = "FF";
  rules.Rule2 = "F[+X][-X]FX";
  params.iterations = 7;
  params.theta = 25;
  params.scale = 1.5;  
}
function setRules6(){
  rules.axiom = "X";
  rules.mainRule = "FF";
  rules.Rule2 = "F-[[X]+X]+F[+FX]-X";
  params.iterations = 6;
  params.theta = 25;
  params.scale = 2;  
}


