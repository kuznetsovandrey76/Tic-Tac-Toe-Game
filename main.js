// Пока не выбрал каким хожу на экране ничего нет
board.style.display = 'none';

// plus - хожу первым РАБОТАЕТ
plus.addEventListener('click', function() {
	board.style.display = 'block';
	choice.style.display = 'none';
});

// zero - хожу вторым
zero.addEventListener('click', function() {
	board.style.display = 'block';
	choice.style.display = 'none';
	// здесь запуск первого хода ПК
	computerStep();
});

var cell = document.querySelectorAll('div'),
	queue = true, // если true то мой ход
	help = true, // AI включен, подобие интеллекта  
	pcWin = false,
	combination = [	0,0,0,
					0,0,0,
					0,0,0 ],
	event;

for (var i = 0; i < cell.length; i++) {
	event = cell[i];
	cell[i].number = i;
	event.addEventListener('click', function() {
		if (this.style.background == 'lightgreen' || this.style.background == '') { 
			this.style.background = 'tomato';

			// Когда выбираю ячейку, ей присваивается значение 1
			combination[this.number] = 1;
		} else { 
			this.style.background = 'lightgreen';
			combination[this.number] = 0;
		}
		// Запуск мозгов (в т.ч. проверки на выигрыш)
		myStep(combination);
		// Определяю очередность ходов
		queue ? queue = false : queue = true;
		computerStep();

		// # -> Здесь заканчивается общий ход
		// console.log(combination); 
	});
}
// Выигрышные комбинации 
// .* - между цифрами стоит неопределенное количество других цифр 
var win = /123|456|789|1.*4.*7|2.*5.*8|3.*6.*9|1.*5.*9|3.*5.*7/g;

function myStep(arr) {
	// myTEMP - здесь мои ходы (1-9)
	var myTEMP = [];
	var pcTEMP = [];
	for (var i = 0; i < arr.length; i++) {
		// Добавляю в myTEMP все выбранные мной ячейки 
		if (arr[i] === 1) myTEMP.push(i + 1);
	}
	for (var i = 0; i < arr.length; i++) {
		// Добавляю в myTEMP все выбранные мной ячейки 
		if (arr[i] === 2) pcTEMP.push(i + 1);
	}

	// Вывожу есть ли выигрышная комбинация, res - true или null 
	// myTEMP.join('') - выводим все выбранные элементы
	var res = myTEMP.join('').match(win);
	var resPC = pcTEMP.join('').match(win);
	// Если я выиграл - yes
	// console.log(res ? 'I - YES' : 'I - now'); 
	// console.log(resPC ? 'PC - YES' : 'PC - now'); 
	// console.log(queue); // !!
	console.log(myTEMP.join(''));
	console.log(pcTEMP.join('') + ' - PC');
	// console.log(win);

	// AI магия :)
	// Предвыигрышные комбинации
	var ai = [ [/12/g, 3], [/23/g, 1], [/1.*3/g, 2], [/45/g, 6], [/56/g, 4], [/4.*6/g, 5], [/78/g, 9], [/89/g, 7], [/7.*9/g, 8], [/1.*4/g, 7], [/4.*7/g, 1], [/1.*7/g, 4], [/2.*5/g, 8], [/5.*8/g, 2], [/2.*8/g, 5], [/3.*6/g, 9], [/6.*9/g, 3], [/3.*9/g, 6], [/1.*5/g, 9], [/5.*9/g, 1], [/1.*9/g, 5], [/3.*5/g, 7], [/5.*7/g, 3], [/3.*7/g, 5] ];

	// Предвыигрышная компинация ПК
	for (var i = 0; i < ai.length; i++) {
		if (pcTEMP.join('').match(ai[i][0]) && cell[ai[i][1] - 1].style.background != 'tomato') {
			cell[ai[i][1] - 1].style.background = 'orange';
			combination[ai[i][1] - 1] = 2;
			help = false;
			pcWin = true;
			break;
		}
	}


	if (!pcWin) { 
		for (var i = 0; i < ai.length; i++) {
			// var res = myTEMP.join('').match(win);

			// МОЯ предвыигрышная комбинация && Ячейка указанная вторым аргументом не оранжевая
			if (myTEMP.join('').match(ai[i][0]) && cell[ai[i][1] - 1].style.background != 'orange' && cell[ai[i][1] - 1].style.background != 'tomato') {
				cell[ai[i][1] - 1].style.background = 'orange';

				// !!! Не обновляется информация по заполненным полям
				// !!! Компьютер не пытается выиграть
				combination[ai[i][1] - 1] = 2;
				// help - если попал в этот цикл computerStep отменяется
				help = false;
				// Прерываю цикл, чтоб не допустить двух ходов ПК 
				break;
			}
		}
	}
}

function computerStep() {
	// ? можно установить setTimeout на ход компьютера + 
	// заблокировать мне доступ к ходу
	if (help) { 
		var computerArr = [];
		for(var i = 0; i < combination.length; i++) {
			// Добавляю варианты для хода компьютера
			if(combination[i] === 0 ) computerArr.push(i);
		}
		// console.log(combination);

		var out = computerArr[Math.floor(Math.random() * computerArr.length)]; // Easy PC
		cell[out].style.background = 'orange';
		// ПК неправильно отмечает свой ход
		combination[out] = 2;
	}
	help = true;
}