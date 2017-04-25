var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

console.log("This is the window size: " + window.innerWidth);

var drone_list = [];
var droneImage = new Image();
droneImage.src = "Images/drone.png";

var drone_x = 650;
var drone_y = 180;
var drone_width = 110;
var drone_height = 75;

// Logs for each Pi
var log1_commands = [];
var log2_commands = [];
var log3_commands = [];
var log4_commands = [];
var log5_commands = [];

var state_list = ["Leader","Follower","Follower","Follower","Follower"];
var status_list = ["On","On","On","Off","On"];

document.onkeydown = checkKey;

function checkKey(e) {

  var direction_input;
  e = e || window.event;

  // Need to change for Leader
  if(log1_commands.length == 10){
    log1_commands.shift();
  }

  if(e.keyCode == '38'){
    log1_commands.push('up');
    direction_input = 'up';
    drone_width -= 5;
    drone_height -= 5;
    drone_y -= 20;
  }
  else if (e.keyCode == '40') {
    log1_commands.push('down');
    direction_input = 'down';
    drone_width += 5;
    drone_height += 5;
    drone_y += 20;
  }
  else if (e.keyCode == '37') {
    log1_commands.push('left');
    direction_input = 'left';
    drone_x -= 20;
  }
  else if (e.keyCode == '39') {
    log1_commands.push('right');
    direction_input = 'right';
    drone_x += 20;
  }

  // send the direction to the cgi file
  $.ajax({
    type: "GET",
    url: "/cgi-bin/raft_gui_input.cgi",
    data: {direction: direction_input},
    success: function(data,status,xhr){console.log("Success");
                                       console.log(data+"\n"+status+"\n"+xhr);},
    error: function(xhr,status,error){console.log("Error");},
    dataType: "text"
  });

}

$('#myCanvas').click(function (e) {

    var direction_input;

    // Need to change for Leader
    if(log1_commands.length == 10){
      log1_commands.shift();
    }

    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;

    console.log(clickedX);
    console.log(clickedY);

    if((clickedY >= 600 && clickedY <= 665) && (clickedX >= 1245 && clickedX <= 1286)){
      log1_commands.push('up');
      direction_input = 'up';
      drone_width -= 5;
      drone_height -= 5;
      drone_y -= 20;
    }
    else if((clickedY >= 690 && clickedY <= 765) && (clickedX >= 1245 && clickedX <= 1286)){
      log1_commands.push('down');
      direction_input = 'down';
      drone_width += 5;
      drone_height += 5;
      drone_y += 20;
    }
    else if((clickedY >= 655 && clickedY <= 695) && (clickedX >= 1170 && clickedX <= 1245)){
      log1_commands.push('left');
      direction_input = 'left';
      drone_x -= 20;
    }
    else if((clickedY >= 655 && clickedY <= 695) && (clickedX >= 1295 && clickedX <= 1355)){
      log1_commands.push('right');
      direction_input = 'right';
      drone_x += 20;
    }
});

// Set both background images
var controlImage = new Image();
controlImage.src = "Images/controlBackground.jpg";

var grassBackground = new Image();
grassBackground.src = "Images/grasslands.png";

function draw(){
  context.clearRect(0,0,1500,800);

  context.drawImage(controlImage,0,480,1600,400);
  context.drawImage(grassBackground,0,0,1600,480);

  context.font = "15px Arial";
  var log1 = new Log(context,520,500);
  log1.makeLog();
  for(var i = 0; i < log1_commands.length; i++){
    log1.addEntry(log1_commands[i]);
  }

  var log2 = new Log(context,520,560);
  log2.makeLog();
  for(var i = 0; i < log2_commands.length; i++){
    log1.addEntry(log2_commands[i]);
  }

  var log3 = new Log(context,520,620);
  log3.makeLog();
  for(var i = 0; i < log3_commands.length; i++){
    log1.addEntry(log3_commands[i]);
  }

  var log4 = new Log(context,520,680);
  log4.makeLog();

  var log5 = new Log(context,520,740);
  log5.makeLog();

  var hostname1 = new Hostname(context, "H1");
  hostname1.draw(470,532);

  var hostname2 = new Hostname(context, "H2");
  hostname2.draw(470,592);

  var hostname3 = new Hostname(context, "H3");
  hostname3.draw(470,652);

  var hostname4 = new Hostname(context, "H4");
  hostname4.draw(470,712);

  var hostname5 = new Hostname(context, "H5");
  hostname5.draw(470,772);

  var state_x = 340;
  var state_y = 530;

  for(var i = 0; i < state_list.length; i++){
    var state = new State(context, state_list[i]);
    state.draw(state_x, state_y);
    state_y += 60;
  }

  var status_x = 250;
  var status_y = 530;

  for(var i = 0; i < status_list.length; i++){
    var state = new Status(context, status_list[i]);
    state.draw(status_x, status_y);
    status_y += 60;
  }

  //context.drawImage(droneImage,drone_x,drone_y,drone_width,drone_height);
  makeSwarm(drone_x,drone_y);

  context.font = "30px Arial";

  context.fillText("Use Arrow Keys to",1135,520);
  context.fillText("Control Drone",1165,560);

  var arrow = new Arrows(context);
  arrow.drawUpArrow(1240,600);
  arrow.drawRightArrow(1280,650);
  arrow.drawDownArrow(1240,705);
  arrow.drawLeftArrow(1175,650);
}

// Creates the swarm
function makeSwarm(x,y){
    if(status_list[0] == "On"){
      context.drawImage(droneImage,x+50,y-40,drone_width-20,drone_height-10);
    }

    if(status_list[1] == "On"){
      context.drawImage(droneImage,x-20,y,drone_width,drone_height);
    }

    if(status_list[2] == "On"){
      context.drawImage(droneImage,x+100,y,drone_width,drone_height);
    }

    if(status_list[3] == "On"){
      context.drawImage(droneImage,x-30,y+50,drone_width+30,drone_height+20);
    }

    if(status_list[4] == "On"){
      context.drawImage(droneImage,x+100,y+50,drone_width+30,drone_height+20);
    }
}

// Will check logs for any updates
function checkLogs(){

}

draw();

//setInterval(checkLogs, 50);
setInterval(draw, 50);
