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
var candyInterval;
var distance;
var toEat;

var emptyCells;
var image;
var counter;
var monster_position;
var candy_position;

var ghost_image;
var candy_image;
var num_of_candies;
var monster_starts;
var pacman_life;
var username;
var foodEaten;

var audio = new Audio('music/pacman.mp3');
var up;
var down;
var right;
var left;
var tookclock;
$(document).ready(function () {
	context = canvas.getContext("2d");
});

function setSettings() {
	$("#time_settings_read").val($("#settings_form").find('input[name=time]').val());
	$("#food_settings_read").val($("#settings_form").find('input[name=food]').val());
	$("#monster_settings_read").val($("#settings_form").find('input[name=monsters]').val());
	$("#5_points_settings_read").css({ 'background-color': "" + $("#settings_form").find('input[name=5points]').val() });
	$("#15_points_settings_read").css({ 'background-color': "" + $("#settings_form").find('input[name=15points]').val() });
	$("#25_points_settings_read").css({ 'background-color': "" + $("#settings_form").find('input[name=25points]').val() });
	let key = $("#settings_form").find('input[name=up]').val();
	$("#up_settings_read").val(keyboardMap[key]);
	key = $("#settings_form").find('input[name=down]').val();
	$("#down_settings_read").val(keyboardMap[key]);
	key = $("#settings_form").find('input[name=left]').val();
	$("#right_settings_read").val(keyboardMap[key]);
	key = $("#settings_form").find('input[name=right]').val();
	$("#left_settings_read").val(keyboardMap[key]);
}

function Start() {
	for (var i = 0; i < 5; i++) {
		document.getElementById("life" + i).style.display = ("inline");
	}
	setSettings()
	num_of_candies = 1;
	toEat = $("#settings_form").find('input[name=food]').val();
	toEat++;
	window.clearInterval(interval);
	window.clearInterval(monsterInterval);
	window.clearInterval(candyInterval);
	let form = document.getElementById("settings_form");
	score = 0;
	clearInterval(counter);
	username = document.querySelector('#lblUsername');
	username.textContent = $("#login_form").find('input[name=name]').val();
	var display = document.querySelector('#lblTime');
	var count = $("#settings_form").find('input[name=time]').val();
	var specialPoints = 1;
	var clocks = 1;
	if (count == $("#settings_form").find('input[name=time]').val()) {
		foodEaten = 0;
	}
	tookclock = 0;
	counter = setInterval(timer, 1000); //1000 will  run it every 1 second
	function timer() {
		if (tookclock == 1) {
			tookclock = 0;
			count = count + 15;
			display.textContent = count;
		}
		if (foodEaten == toEat) {
			count =1	;
			display.textContent = count;
		}
		count = count - 1;
		if (count <= 0) {
			clearInterval(counter);
			if (score < 100) {
				alert("You are better than " + score + " points");
				window.clearInterval(interval)
				window.clearInterval(monsterInterval)
				window.clearInterval(candyInterval);

			}
			else {
				alert("Winner!!!");
				window.clearInterval(interval)
				window.clearInterval(monsterInterval)
				window.clearInterval(candyInterval);

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
	candy_image = new Image();
	candy_image.src = './img/extraPoints.png';
	board = new Array();
	candy_position = new Array();
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
	}
	while (clocks > 0) {
		let emptyCell = findRandomEmptyCell(board)
		board[emptyCell[0]][emptyCell[1]] = 100;
		clocks--;
	}
	while (num_of_candies > 0) {
		let emptyCell = findRandomEmptyCell(board)
		candy_position[0] = emptyCell[0];
		candy_position[1] = emptyCell[1];
		num_of_candies--;
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
	candyInterval = setInterval(moveCandy, 250)


}

function moveCandy() {
	x = Math.random()
	if (x < 0.25 && !isMonsterCell(candy_position[0], candy_position[1] - 1) && candy_position[1] > 0 && board[candy_position[0]][candy_position[1] - 1] != 4) {
		candy_position[1]--;
	}
	else {
		if (x < 0.5 && !isMonsterCell(candy_position[0], candy_position[1] + 1) && candy_position[1] < 9 && board[candy_position[0]][candy_position[1] + 1] != 4) {
			candy_position[1]++;
		}
		else {
			if (x < 0.5 && !isMonsterCell(candy_position[0] - 1, candy_position[1]) && candy_position[0] > 0 && board[candy_position[0] - 1][candy_position[1]] != 4) {
				candy_position[0]--;
			}
			else {
				if (!isMonsterCell(candy_position[0] + 1, candy_position[1]) && candy_position[0] < 9 && board[candy_position[0] + 1][candy_position[1]] != 4) {
					candy_position[0]++;
				}
			}
		}
	}
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
function isCandyCell(i, j) {
	if (candy_position[0] == i && candy_position[1] == j) {
		return true;
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
			}
			else if (isCandyCell(i, j)) {
				context.drawImage(candy_image, center.x - 25, center.y - 25);
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
	
	else if (board[shape.i][shape.j] == 5) {
		foodEaten++;
		score = score + 5;
		emptyCells.push(d);
	}
	else if (board[shape.i][shape.j] == 15) {
		foodEaten++;
		score = score + 15;
		emptyCells.push(d);
	}
	else if (board[shape.i][shape.j] == 25) {
		foodEaten++;
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
		foodEaten++;
	}
	else if (board[shape.i][shape.j] == 100) {
		tookclock = 1;
		emptyCells.push(d);
	}
	if (isCandyCell(shape.i, shape.j)) {
		score = score + 50
		candy_image.src = "";
		candy_position[0] = 50;
		candy_position[1] = 50;
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
	window.clearInterval(candyInterval)

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

var keyboardMap = [
	"", // [0]
	"", // [1]
	"", // [2]
	"CANCEL", // [3]
	"", // [4]
	"", // [5]
	"HELP", // [6]
	"", // [7]
	"BACK_SPACE", // [8]
	"TAB", // [9]
	"", // [10]
	"", // [11]
	"CLEAR", // [12]
	"ENTER", // [13]
	"ENTER_SPECIAL", // [14]
	"", // [15]
	"SHIFT", // [16]
	"CONTROL", // [17]
	"ALT", // [18]
	"PAUSE", // [19]
	"CAPS_LOCK", // [20]
	"KANA", // [21]
	"EISU", // [22]
	"JUNJA", // [23]
	"FINAL", // [24]
	"HANJA", // [25]
	"", // [26]
	"ESCAPE", // [27]
	"CONVERT", // [28]
	"NONCONVERT", // [29]
	"ACCEPT", // [30]
	"MODECHANGE", // [31]
	"SPACE", // [32]
	"PAGE_UP", // [33]
	"PAGE_DOWN", // [34]
	"END", // [35]
	"HOME", // [36]
	"LEFT", // [37]
	"UP", // [38]
	"RIGHT", // [39]
	"DOWN", // [40]
	"SELECT", // [41]
	"PRINT", // [42]
	"EXECUTE", // [43]
	"PRINTSCREEN", // [44]
	"INSERT", // [45]
	"DELETE", // [46]
	"", // [47]
	"0", // [48]
	"1", // [49]
	"2", // [50]
	"3", // [51]
	"4", // [52]
	"5", // [53]
	"6", // [54]
	"7", // [55]
	"8", // [56]
	"9", // [57]
	"COLON", // [58]
	"SEMICOLON", // [59]
	"LESS_THAN", // [60]
	"EQUALS", // [61]
	"GREATER_THAN", // [62]
	"QUESTION_MARK", // [63]
	"AT", // [64]
	"A", // [65]
	"B", // [66]
	"C", // [67]
	"D", // [68]
	"E", // [69]
	"F", // [70]
	"G", // [71]
	"H", // [72]
	"I", // [73]
	"J", // [74]
	"K", // [75]
	"L", // [76]
	"M", // [77]
	"N", // [78]
	"O", // [79]
	"P", // [80]
	"Q", // [81]
	"R", // [82]
	"S", // [83]
	"T", // [84]
	"U", // [85]
	"V", // [86]
	"W", // [87]
	"X", // [88]
	"Y", // [89]
	"Z", // [90]
	"OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
	"", // [92]
	"CONTEXT_MENU", // [93]
	"", // [94]
	"SLEEP", // [95]
	"NUMPAD0", // [96]
	"NUMPAD1", // [97]
	"NUMPAD2", // [98]
	"NUMPAD3", // [99]
	"NUMPAD4", // [100]
	"NUMPAD5", // [101]
	"NUMPAD6", // [102]
	"NUMPAD7", // [103]
	"NUMPAD8", // [104]
	"NUMPAD9", // [105]
	"MULTIPLY", // [106]
	"ADD", // [107]
	"SEPARATOR", // [108]
	"SUBTRACT", // [109]
	"DECIMAL", // [110]
	"DIVIDE", // [111]
	"F1", // [112]
	"F2", // [113]
	"F3", // [114]
	"F4", // [115]
	"F5", // [116]
	"F6", // [117]
	"F7", // [118]
	"F8", // [119]
	"F9", // [120]
	"F10", // [121]
	"F11", // [122]
	"F12", // [123]
	"F13", // [124]
	"F14", // [125]
	"F15", // [126]
	"F16", // [127]
	"F17", // [128]
	"F18", // [129]
	"F19", // [130]
	"F20", // [131]
	"F21", // [132]
	"F22", // [133]
	"F23", // [134]
	"F24", // [135]
	"", // [136]
	"", // [137]
	"", // [138]
	"", // [139]
	"", // [140]
	"", // [141]
	"", // [142]
	"", // [143]
	"NUM_LOCK", // [144]
	"SCROLL_LOCK", // [145]
	"WIN_OEM_FJ_JISHO", // [146]
	"WIN_OEM_FJ_MASSHOU", // [147]
	"WIN_OEM_FJ_TOUROKU", // [148]
	"WIN_OEM_FJ_LOYA", // [149]
	"WIN_OEM_FJ_ROYA", // [150]
	"", // [151]
	"", // [152]
	"", // [153]
	"", // [154]
	"", // [155]
	"", // [156]
	"", // [157]
	"", // [158]
	"", // [159]
	"CIRCUMFLEX", // [160]
	"EXCLAMATION", // [161]
	"DOUBLE_QUOTE", // [162]
	"HASH", // [163]
	"DOLLAR", // [164]
	"PERCENT", // [165]
	"AMPERSAND", // [166]
	"UNDERSCORE", // [167]
	"OPEN_PAREN", // [168]
	"CLOSE_PAREN", // [169]
	"ASTERISK", // [170]
	"PLUS", // [171]
	"PIPE", // [172]
	"HYPHEN_MINUS", // [173]
	"OPEN_CURLY_BRACKET", // [174]
	"CLOSE_CURLY_BRACKET", // [175]
	"TILDE", // [176]
	"", // [177]
	"", // [178]
	"", // [179]
	"", // [180]
	"VOLUME_MUTE", // [181]
	"VOLUME_DOWN", // [182]
	"VOLUME_UP", // [183]
	"", // [184]
	"", // [185]
	"SEMICOLON", // [186]
	"EQUALS", // [187]
	"COMMA", // [188]
	"MINUS", // [189]
	"PERIOD", // [190]
	"SLASH", // [191]
	"BACK_QUOTE", // [192]
	"", // [193]
	"", // [194]
	"", // [195]
	"", // [196]
	"", // [197]
	"", // [198]
	"", // [199]
	"", // [200]
	"", // [201]
	"", // [202]
	"", // [203]
	"", // [204]
	"", // [205]
	"", // [206]
	"", // [207]
	"", // [208]
	"", // [209]
	"", // [210]
	"", // [211]
	"", // [212]
	"", // [213]
	"", // [214]
	"", // [215]
	"", // [216]
	"", // [217]
	"", // [218]
	"OPEN_BRACKET", // [219]
	"BACK_SLASH", // [220]
	"CLOSE_BRACKET", // [221]
	"QUOTE", // [222]
	"", // [223]
	"META", // [224]
	"ALTGR", // [225]
	"", // [226]
	"WIN_ICO_HELP", // [227]
	"WIN_ICO_00", // [228]
	"", // [229]
	"WIN_ICO_CLEAR", // [230]
	"", // [231]
	"", // [232]
	"WIN_OEM_RESET", // [233]
	"WIN_OEM_JUMP", // [234]
	"WIN_OEM_PA1", // [235]
	"WIN_OEM_PA2", // [236]
	"WIN_OEM_PA3", // [237]
	"WIN_OEM_WSCTRL", // [238]
	"WIN_OEM_CUSEL", // [239]
	"WIN_OEM_ATTN", // [240]
	"WIN_OEM_FINISH", // [241]
	"WIN_OEM_COPY", // [242]
	"WIN_OEM_AUTO", // [243]
	"WIN_OEM_ENLW", // [244]
	"WIN_OEM_BACKTAB", // [245]
	"ATTN", // [246]
	"CRSEL", // [247]
	"EXSEL", // [248]
	"EREOF", // [249]
	"PLAY", // [250]
	"ZOOM", // [251]
	"", // [252]
	"PA1", // [253]
	"WIN_OEM_CLEAR", // [254]
	"" // [255]
];