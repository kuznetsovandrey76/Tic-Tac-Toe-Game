var cell = document.querySelectorAll('div'),
	// если true то мой ход
	queue = true, 
	// AI включен, подобие интеллекта
	help = true,   
	pcWin = false,
	// Записываю куда сделаны ходы
	// 0 - свободное поле
	// 1 - мой ход
	// 2 - ход ПК
	combination = [	0,0,0,
					0,0,0,
					0,0,0 ],
	event;
// Определение того кто выиграл
var you = false,
	pc = false;
// Подсчет количества сделанных ходов
var stepCount = 0;	
// Выигрышные комбинации 
// .* - между цифрами стоит неопределенное количество других цифр 
var win = /123|456|789|1.*4.*7|2.*5.*8|3.*6.*9|1.*5.*9|3.*5.*7/g;

// Пока не выбрал каким хожу на экране ничего нет
board.style.display = 'none';

// plus - хожу первым 
plus.addEventListener('click', function() {
	board.style.display = 'block';
	choice.style.display = 'none';
});
// zero - хожу вторым
zero.addEventListener('click', function() {
	board.style.display = 'block';
	choice.style.display = 'none';
	// Запуск первого хода ПК с задержкой
	setTimeout(computerStep, 100);
});


for (var i = 0; i < cell.length; i++) {
	event = cell[i];
	cell[i].number = i;
	event.addEventListener('click', function() {
		if (this.innerHTML == '') { 
			this.innerHTML = 'x';
			// Когда выбираю ячейку, ей присваивается значение 1
			combination[this.number] = 1;

			// Запуск мозгов (в т.ч. проверки на выигрыш)
			myStep(combination);
			// Определяю очередность ходов
			queue ? queue = false : queue = true;
			computerStep();

			// Прекращаем кон
			// или все поля заполнены
			if(you || pc || stepCount > 8) {
				setTimeout(restart, 100); 
			} 			
		} 
	});
}

function myStep(arr) {
	stepCount++;
	// myTEMP - здесь мои ходы (1-9)
	var myTEMP = [];
	var pcTEMP = [];
	for (var i = 0; i < arr.length; i++) {
		// Добавляю в myTEMP все выбранные мной ячейки 
		if (arr[i] === 1) myTEMP.push(i + 1);
	}
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === 2) pcTEMP.push(i + 1);
	}

	// Вывожу есть ли выигрышная комбинация, res - true или null 
	// myTEMP.join('') - выводим все выбранные элементы
	var res = myTEMP.join('').match(win);
	var resPC = pcTEMP.join('').match(win);
	// Если я выиграл - yes
	// Когда res - true я выиграл

	res ? winner('You') : null;
	
	// console.log(res ? 'I - YES' : 'I - now'); 
	// console.log(resPC ? 'PC - YES' : 'PC - now'); 
	// console.log(myTEMP.join(''));
	// console.log(pcTEMP.join('') + ' - PC');

	// AI магия :)
	// Предвыигрышные комбинации
	var ai = [ [/12/g, 3], [/23/g, 1], [/1.*3/g, 2], [/45/g, 6], [/56/g, 4], [/4.*6/g, 5], [/78/g, 9], [/89/g, 7], [/7.*9/g, 8], [/1.*4/g, 7], [/4.*7/g, 1], [/1.*7/g, 4], [/2.*5/g, 8], [/5.*8/g, 2], [/2.*8/g, 5], [/3.*6/g, 9], [/6.*9/g, 3], [/3.*9/g, 6], [/1.*5/g, 9], [/5.*9/g, 1], [/1.*9/g, 5], [/3.*5/g, 7], [/5.*7/g, 3], [/3.*7/g, 5] ];

	// Предвыигрышная компинация ПК
	for (var i = 0; i < ai.length; i++) {
		if (pcTEMP.join('').match(ai[i][0]) && cell[ai[i][1] - 1].innerHTML != 'x') {
			help = false;
			if (!you) { 
				stepCount++;
				cell[ai[i][1] - 1].innerHTML = 'o';
			}
			pcWin = true;
			combination[ai[i][1] - 1] = 2;
			pcWin ? winner('PC') : null;
			break;
		}
	}

	if (!pcWin) { 
		for (var i = 0; i < ai.length; i++) {
			// МОЯ предвыигрышная комбинация 
			if (myTEMP.join('').match(ai[i][0]) && cell[ai[i][1] - 1].innerHTML != 'o' && cell[ai[i][1] - 1].innerHTML != 'x') {
				help = false;
				if (!you) { 
					stepCount++;
					cell[ai[i][1] - 1].innerHTML = 'o';
				}
				combination[ai[i][1] - 1] = 2;
				// help - если попал в этот цикл computerStep отменяется
				// Прерываю цикл, чтоб не допустить двух ходов ПК 
				break;
			}
		}
	}
}

function computerStep() {
	if (help) { 
		stepCount++;
		var computerArr = [];
		for(var i = 0; i < combination.length; i++) {
			// Добавляю варианты для хода компьютера
			if(combination[i] === 0 ) computerArr.push(i);
		}
		var out = computerArr[Math.floor(Math.random() * computerArr.length)]; // Easy PC
		if (stepCount < 10) { 
			cell[out].innerHTML = 'o';
		}
		combination[out] = 2;
	}
	help = true;
}

function winner(who) {
	switch(who) {
		case 'You':
			you = true;
			break;
		case 'PC':
			pc = true;
			break;
	}
}

// эта функция запускается когда кто-то выиграл
function restart() {
	// Отсюда переход на стартовый экран
	end.style.display = 'block';

	if (you) {  
		p.innerHTML = 'YOU win';
	} else if (pc){
		p.innerHTML = 'PC win';		
	} else {
		p.innerHTML = 'draw';	
	}
}

// Сброс всего при перезапуске
repeat.addEventListener('click', function() {
	board.style.display = 'none';
	end.style.display = 'none';
	choice.style.display = 'block';

	you = false;
	pc = false;
	queue = true; 
	help = true; 
	pcWin = false;
	combination = [	0,0,0,0,0,0,0,0,0 ],
	stepCount = 0;

	cell.forEach( function(element) {
		element.innerHTML = '';
	});

});