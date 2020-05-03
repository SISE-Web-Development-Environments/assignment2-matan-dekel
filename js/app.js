var context;
var shape = new Object();
var board;
var score;
var pac_color;
var points5;
var points15;
var points25;
var start_time;
var time_elapsed;
var interval;



var audio = new Audio('music/pacman.mp3');
var up;
var down;
var right;
var left;
$(document).ready(function() {
	context = canvas.getContext("2d");
});

function Start() {
	let form = document.getElementById("settings_form")
	let time = $("#settings_form").find('input[name=time]').val();
	display = document.querySelector('#lblTime');
	startTimer(time, display);	
	delete time	

	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = $("#settings_form").find('input[name=food]').val();
	var fivePoints=food_remain*0.6;
	var fifteenPoints=food_remain*0.3
	var twentyFivePoints=food_remain*0.1;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					var secondRandomNum = Math.random();
					if(secondRandomNum<1/3){
						if(fivePoints>0){
							board[i][j] = 5;
							fivePoints--;
						}
						else if(fifteenPoints>0){
								board[i][j] = 15;
								fifteenPoints--;
							}	
							else if(twentyFivePoints>0){
								board[i][j] = 15;
								fifteenPoints--;
							}
							else if (secondRandomNum<2/3){
								if(fifteenPoints>0){
									board[i][j] = 15;
									fifteenPoints--;
								}
								else if(twentyFivePoints>0){
									board[i][j] = 25;
									twentyFivePoints--;
									}	
									else if(fivePoints>0){
										board[i][j] = 5;
										fivePoints--;
									}
							}
							else{
								if(twentyFivePoints>0){
									board[i][j] = 25;
									twentyFivePoints--;
									}
									else if(fivePoints>0){
										board[i][j] = 5;
										fivePoints--;
									}
									else if(fifteenPoints>0){
										board[i][j] = 15;
										fifteenPoints--;
									}	
							}
					}
					food_remain--;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			if(e.keyCode == up || e.keyCode == down || e.keyCode == right || e.keyCode == left){
				e.preventDefault();
			}
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

	function startTimer(duration, display) {
		let timer = duration, minutes, seconds;
		setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			display.textContent = minutes + ":" + seconds;
	
			if (--timer < 0) {
				timer = 0;
			}
			else{
				if (timer===0){
					
					if(score<100){
						alert("You are better than "+score+" points");
						scrollto("welcome")
					}
						else{
							alert("Winner!!!");
						}
					}
			}
		}, 1000);
	}


function findRandomEmptyCell(board) {
	audio.play();
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = points5;
				context.fill();
			} 
			else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = points15;
				context.fill();
			}
			else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = points25
				context.fill();
			}else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {

	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	if (board[shape.i][shape.j] == 5) {
		score=score+5;
	}
	if (board[shape.i][shape.j] == 15) {
		score=score+15;
	}
	if (board[shape.i][shape.j] == 25) {
		score=score+25;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
		Draw();
}
