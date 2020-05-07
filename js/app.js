var context;
var shape = new Object();
var board;
var score;
var points5;
var points15;
var points25;
var start_time;
var time_elapsed;
var interval;
var monsterInterval;
var distance;

var emptyCells;
var image;
var counter;
var monster_position;
var ghost_image;
var monster_starts;
var pacman_life;
var username;

var audio = new Audio('music/pacman.mp3');
var up;
var down;
var right;
var left;
var tookclock;
$(document).ready(function () {
	context = canvas.getContext("2d");
});

function Start() {
	for (var i = 0; i < 5; i++) {
		document.getElementById("life" + i).style.display = ("inline");
	}
	window.clearInterval(interval);
	window.clearInterval(monsterInterval);
	let form = document.getElementById("settings_form");
	score = 0;
	clearInterval(counter);
	username = document.querySelector('#lblUsername');
	username.textContent = $("#login_form").find('input[name=name]').val();
	var display = document.querySelector('#lblTime');
	var count = $("#settings_form").find('input[name=time]').val();
	var specialPoints = 1;
	var clocks = 1;

	tookclock = 0;
	counter = setInterval(timer, 1000); //1000 will  run it every 1 second
	function timer() {
		if (tookclock == 1) {
			tookclock = 0;
			count = count + 15;
			display.textContent = count;

		}
		count = count - 1;
		if (count <= 0) {
			clearInterval(counter);
			if (score < 100) {
				alert("You are better than " + score + " points");
				window.clearInterval(interval)
				window.clearInterval(monsterInterval)
			}
			else {
				alert("Winner!!!");
				window.clearInterval(interval)
				window.clearInterval(monsterInterval)
			}
		}
		display.textContent = count;
	}


	pacman_life = 5;
	pac_image = new Image();
	pac_image.src = './img/pacman-right.png';
	clock_image = new Image();
	clock_image.src = './img/clock.png';
	ghost_image = new Image();
	ghost_image.src = './img/ghost.png';
	board = new Array();
	var cnt = 100;
	emptyCells = new Array()
	let food_remain = $("#settings_form").find('input[name=food]').val();
	let fifteenPoints = Math.floor(food_remain * 0.3);
	let twentyFivePoints = Math.floor(food_remain * 0.1);
	let fivePoints = food_remain - (fifteenPoints + twentyFivePoints);

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
				(i == 6 && j == 2)) {
				board[i][j] = 4;
			}
			else {
				board[i][j] = 0;
				let d = { "x": "y" }
				d.x = i;
				d.y = j;
				emptyCells.push(d);
			}
		}
	}
	placeMonsters();

	while (fivePoints > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 5;
		fivePoints--;
		food_remain--;
	}
	while (fifteenPoints > 0) {
		let emptyCell = findRandomEmptyCell(board)
		board[emptyCell[0]][emptyCell[1]] = 15;
		fifteenPoints--;
		food_remain--;
	}
	while (twentyFivePoints > 0) {
		let emptyCell = findRandomEmptyCell(board)
		board[emptyCell[0]][emptyCell[1]] = 25;
		twentyFivePoints--;
		food_remain--;
	}
	while (specialPoints > 0) {
		let emptyCell = findRandomEmptyCell(board)
		board[emptyCell[0]][emptyCell[1]] = 40;
		specialPoints--;
		food_remain--;
	}
	while (clocks > 0) {
		let emptyCell = findRandomEmptyCell(board)
		board[emptyCell[0]][emptyCell[1]] = 100;
		clocks--;
	}
	let emptyCell = findRandomEmptyCell()
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			if (e.keyCode == up || e.keyCode == down || e.keyCode == right || e.keyCode == left) {
				e.preventDefault();
			}
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	audio.play();

	interval = setInterval(UpdatePosition, 150);
	monsterInterval = setInterval(moveMonsters, 575);

}

function moveMonsters() {
	let num = $("#settings_form").find('input[name=monsters]').val();
	for (var i = 0; i < num; i++) {
		UpdateMonsterPosition(i, whereMonsterGoes(i));
	}
}

function whereMonsterGoes(i) {
	distance = 300000;
	distance = getEuclideanDistance(monster_position[i][0] + 1, monster_position[i][1], shape.i, shape.j)
	if (distance > getEuclideanDistance(monster_position[i][0], monster_position[i][1] + 1, shape.i, shape.j)) {
		distance = getEuclideanDistance(monster_position[i][0], monster_position[i][1] + 1, shape.i, shape.j);
	}
	if (distance > getEuclideanDistance(monster_position[i][0] - 1, monster_position[i][1], shape.i, shape.j)) {
		distance = getEuclideanDistance(monster_position[i][0] - 1, monster_position[i][1], shape.i, shape.j)
	}
	if (distance > getEuclideanDistance(monster_position[i][0], monster_position[i][1] - 1, shape.i, shape.j)) {
		distance = getEuclideanDistance(monster_position[i][0], monster_position[i][1] - 1, shape.i, shape.j)
	}
	if (distance == getEuclideanDistance(monster_position[i][0], monster_position[i][1] - 1, shape.i, shape.j)) {
		return 1;
	}
	else if (distance == getEuclideanDistance(monster_position[i][0], monster_position[i][1] + 1, shape.i, shape.j)) {
		return 2;
	}
	else if (distance == getEuclideanDistance(monster_position[i][0] - 1, monster_position[i][1], shape.i, shape.j)) {
		return 3;
	}
	else if (distance == getEuclideanDistance(monster_position[i][0] + 1, monster_position[i][1], shape.i, shape.j)) {
		return 4;
	}


}
function getEuclideanDistance(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt(a * a + b * b);
}

function getNextMonsterCell() {
	return monster_starts.pop();
}

function findRandomEmptyCell(board) {
	let i = Math.floor(Math.random() * Math.floor(emptyCells.length - 1));
	let cell = emptyCells[i];
	emptyCells.splice(i, 1)
	return [cell.x, cell.y];
}

function GetKeyPressed() {
	lblScore.value = score;
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

function isMonsterCell(i, j) {
	let num_of_monster = $("#settings_form").find('input[name=monsters]').val();
	num_of_monster--;
	while (num_of_monster >= 0) {
		if (monster_position[num_of_monster][0] == i && monster_position[num_of_monster][1] == j) {
			return true;
		}
		num_of_monster--;
	}
	return false;
}

function Draw() {
	canvas.width = canvas.width; //clean board
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (isMonsterCell(i, j)) {
				context.drawImage(ghost_image, center.x - 25, center.y - 25);
			} else if (board[i][j] == 2) {
				context.drawImage(pac_image, center.x - 25, center.y - 25);
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
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == 40) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			}
			else if (board[i][j] == 100) {
				context.drawImage(clock_image, center.x - 25, center.y - 25);
			}
		}
	}
}




function UpdateMonsterPosition(monster, x) {

	if (Math.random() > 0.4) {
		if (x == 1) {
			if (!isMonsterCell(monster_position[monster][0], monster_position[monster][1] - 1) && monster_position[monster][1] > 0 && board[monster_position[monster][0]][monster_position[monster][1] - 1] != 4) {
				monster_position[monster][1]--;
			}
		}
		if (x == 2) {
			if (!isMonsterCell(monster_position[monster][0], monster_position[monster][1] + 1) && monster_position[monster][1] < 9 && board[monster_position[monster][0]][monster_position[monster][1] + 1] != 4) {
				monster_position[monster][1]++;
			}
		}
		if (x == 3) {
			if (!isMonsterCell(monster_position[monster][0] - 1, monster_position[monster][1]) && monster_position[monster][0] > 0 && board[monster_position[monster][0] - 1][monster_position[monster][1]] != 4) {
				monster_position[monster][0]--;
			}
		}
		if (x == 4) {
			if (!isMonsterCell(monster_position[monster][0] + 1, monster_position[monster][1]) && monster_position[monster][0] < 9 && board[monster_position[monster][0] + 1][monster_position[monster][1]] != 4) {
				monster_position[monster][0]++;
			}
		}
	}
	else {
		x = Math.random()
		if (x < 0.25 && !isMonsterCell(monster_position[monster][0], monster_position[monster][1] - 1) && monster_position[monster][1] > 0 && board[monster_position[monster][0]][monster_position[monster][1] - 1] != 4) {
			monster_position[monster][1]--;
		}
		else {
			if (x < 0.5 && !isMonsterCell(monster_position[monster][0], monster_position[monster][1] + 1) && monster_position[monster][1] < 9 && board[monster_position[monster][0]][monster_position[monster][1] + 1] != 4) {
				monster_position[monster][1]++;
			}
			else {
				if (x < 0.75 && !isMonsterCell(monster_position[monster][0] - 1, monster_position[monster][1]) && monster_position[monster][0] > 0 && board[monster_position[monster][0] - 1][monster_position[monster][1]] != 4) {
					monster_position[monster][0]--;
				}
				else {
					if (!isMonsterCell(monster_position[monster][0] + 1, monster_position[monster][1]) && monster_position[monster][0] < 9 && board[monster_position[monster][0] + 1][monster_position[monster][1]] != 4) {
						monster_position[monster][0]++;
					}
				}
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
			pac_image.src = './img/pacman-up.png';
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			pac_image.src = './img/pacman-down.png';
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			pac_image.src = './img/pacman-left.png';
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			pac_image.src = './img/pacman-right.png';
		}
	}
	let d = { "x": "y" }
	d.x = shape.i;
	d.y = shape.j;
	if (isMonsterCell(shape.i, shape.j)) {
		pacman_life--;
		if (pacman_life <= 0) {
			gameOver();
		}
		else {
			startAgain();
		}
	}
	else if (board[shape.i][shape.j] == 1) {
		score++;
		emptyCells.push(d);
	}
	else if (board[shape.i][shape.j] == 5) {
		score = score + 5;
		emptyCells.push(d);
	}
	else if (board[shape.i][shape.j] == 15) {
		score = score + 15;
		emptyCells.push(d);
	}
	else if (board[shape.i][shape.j] == 25) {
		score = score + 25;
		emptyCells.push(d);
	}
	else if (board[shape.i][shape.j] == 40) {
		x = (Math.floor(Math.random() * 2) == 0);
		emptyCells.push(d);
		if (x) {
			score = score + 40;
		} else {
			score = score - 40;
		}
	}
	else if (board[shape.i][shape.j] == 100) {
		tookclock = 1;
		emptyCells.push(d);
	}

	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	Draw();
}

function gameOver() {
	//remove one life picture
	let picture_id = "life" + pacman_life;
	document.getElementById(picture_id).style.display = ("none");
	clearInterval(counter);
	window.clearInterval(interval)
	window.clearInterval(monsterInterval)

	alert("Loser!")
}

function startAgain() {
	//remove one life picture
	let picture_id = "life" + pacman_life;
	document.getElementById(picture_id).style.display = ("none");
	//replace monster in cornners
	placeMonsters();
	//put pacman in random position
	nextPacCell = findRandomEmptyCell();
	console.log(nextPacCell);
	emptyCells.push([shape.i, shape.j]);
	shape.i = nextPacCell[0];
	shape.j = nextPacCell[1];
	//remove 10 points
	score -= 10;
}

function placeMonsters() {
	let num_of_monster = $("#settings_form").find('input[name=monsters]').val();
	monster_position = new Array();
	monster_starts = new Array();
	monster_starts.push([0, 0]);
	monster_starts.push([0, 9]);
	monster_starts.push([9, 0]);
	monster_starts.push([9, 9]);
	while (num_of_monster > 0) {
		let emptyCell = getNextMonsterCell();
		monster_position.push(emptyCell);
		num_of_monster--;
	}
}

