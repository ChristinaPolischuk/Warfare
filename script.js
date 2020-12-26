/*
1. Сделать движение игрока вверх и вниз
2. Сделать выстрел, нажатием на "Пробел"
3. Сделать полет пули
4. Сделать проверку попала ли пуля во врага (муха)
5. Если попали по мухе, сделать взрыв
6. Удалять пулю, когда она вышла за пределы игрового поля
*/

let player = document.querySelector('#player');

let lifes = 3;

document.addEventListener('keydown', function (e) {
	// console.dir(e);
	switch (e.keyCode) {
		//вниз "s"
		case 83:
			player.style.top = player.offsetTop + 50 + 'px';
			break;
		//вверх "w"
		case 87:
			player.style.top = player.offsetTop - 50 + 'px';
			break;
		//выстрел "пробел"
		case 32:
			createBullet();
			break;
	}
});

createEnemy();

function createBullet() {
	let bullet = document.createElement('div');
	bullet.className = 'bullet';
	bullet.style.top = player.offsetTop + 138 + 'px';
	document.body.appendChild(bullet);
	bulletMove(bullet);
}

function bulletMove(bullet) {
	let timerId = setInterval(function () {
		bullet.style.left = bullet.offsetLeft + 10 + 'px';
		isShot(bullet, timerId);
		if (bullet.offsetLeft > document.body.clientWidth) {
			bullet.remove();
			clearInterval(timerId);
		}
	}, 10);
}

function isShot(bullet, timer) {
	let enemy = document.querySelector('.enemy');

	if (enemy != null) {
		//Координаты верхней и нижней точки пули и врага
		let enemyTop = enemy.offsetTop;
		let bulletTop = bullet.offsetTop;
		let enemyBottom = enemy.offsetTop + enemy.offsetHeight;
		let bulletBottom = bullet.offsetTop + bullet.offsetHeight;
		let enemyLeft = enemy.offsetLeft;
		let bulletLeft = bullet.offsetLeft;

		if (bulletTop >= enemyTop && bulletBottom <= enemyBottom && bulletLeft >= enemyLeft) {
			enemy.className = 'boom';
			enemy.style.top = enemyTop - 50 + 'px';
			enemy.style.left = enemyLeft - 50 + 'px';
			clearInterval(enemy.dataset.timer);
			setTimeout(function () {
				enemy.remove();
				createEnemy();
				clearInterval(timer);
				bullet.remove();
			}, 1000);
		}
	}
}

function isBump() {
	let enemy = document.querySelector('.enemy');

	if (enemy.offsetTop > player.offsetTop &&
		enemy.offsetTop < player.offsetTop + player.offsetHeight &&
		enemy.offsetLeft <= player.offsetLeft + player.offsetWidth) {
		enemy.className = 'boom';
		enemy.style.top = player.offsetTop + 50 + 'px';
		enemy.style.left = player.offsetLeft + 50 + 'px';
		clearInterval(enemy.dataset.timer);
		setTimeout(function () {
			enemy.remove();
			createEnemy();
		}, 500);
		die();
	}
}

function createEnemy() {
	let enemy = document.createElement('div');
	enemy.className = 'enemy';
	enemy.style.top = getRandomInteger(200, document.body.offsetHeight - 100) + 'px';
	document.body.appendChild(enemy);
	let timerId = setInterval(function () {
		enemy.style.left = enemy.offsetLeft - 10 + 'px';
		if (enemy.offsetLeft + enemy.offsetWidth < 0) {
			enemy.remove();
			clearInterval(timerId);
			createEnemy();
			die();
		}
		isBump();
	}, 100);
	enemy.dataset.timer = timerId;
}

function getRandomInteger(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

function die() {
	lifes--;
	if (lifes != 0) {
		let lifesBlock = document.querySelector('#lifes');
		let life = lifesBlock.querySelector('span');
		life.remove();
	} else {
		endGame();
	}
}

function endGame() {
	document.body.innerHTML = "";
	alert("Game Over!!!");
	location.reload();
}