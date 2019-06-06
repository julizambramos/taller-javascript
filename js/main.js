function ToggleClass(ElId, ClName) {
  var element, arr;
  element = document.getElementById(ElId);
  arr = element.className.split(" ");
  if (arr.indexOf(ClName) == -1) {
    element.className += " " + ClName;
  }else{
  	arr.splice(arr.indexOf(ClName),1);
  	element.className = arr.join(" ");
  }
}
function HasClass(ElId, ClName) {
  var element;
  element = document.getElementById(ElId);
  if (element.classList.contains(ClName)) {
    return true;
  }
  return false;
}

var calculateProgress = 0;

function iniciar() {
	if(document.getElementById('nombre').value==''){
		ToggleClass('nombre', 'vibrate');
		setTimeout(function() {
			ToggleClass('nombre', 'vibrate');
		},300)
		document.getElementById('nombre').focus();
		return;
	}
	if(document.getElementById('apellido').value==''){
		ToggleClass('apellido', 'vibrate');
		setTimeout(function() {
			ToggleClass('apellido', 'vibrate');
		},300)
		document.getElementById('apellido').focus();
		return;
	}
	if(document.getElementById('puntaje').value=='' || document.getElementById('puntaje').value<0||document.getElementById('puntaje').value>questions.length){
		ToggleClass('puntaje', 'vibrate');
		setTimeout(function() {
			ToggleClass('puntaje', 'vibrate');
		},300)
		document.getElementById('puntaje').focus();
		return;
	}
	ToggleClass("get_data","hidden");
	var te = '';
	for (var i = 0; i < questions.length; i++) {
		te += '<span id="number-'+(i+1)+'" class="round-number">'+(i+1)+'</span>';
	}
	calculateProgress = 100 /questions.length;
	document.getElementById("progress_bar").style.width = (current.answered*calculateProgress)+'%';
	document.getElementById('questions_numbers').innerHTML = te;
	current.fullname = document.getElementById('nombre').value + ' ' + document.getElementById('apellido').value;
	document.getElementById('fullname').innerHTML = current.fullname;
	document.getElementById('all_number').innerHTML = questions.length;
	current.puntaje = parseInt(document.getElementById('puntaje').value);
	document.getElementById('puntaje-pass').innerHTML = current.puntaje;
	document.getElementById('answered').innerHTML = 'Respondidas '+current.answered+'/'+questions.length;
	ToggleClass("navigation","hidden");
	setTimeout(function() {
		ToggleClass("number-"+current.question,"current");
		ToggleClass("question_data","hidden");
		loadQuestion();
	},500);
}

function anterior() {
	ToggleClass("question_data","hidden");
	ToggleClass("number-"+current.question,"current");
	current.question--;
	ToggleClass("number-"+current.question,"current");
	setTimeout(function() {
		loadQuestion();
		ToggleClass("question_data","hidden");
	},500);
}

function siguiente() {
	ToggleClass("question_data","hidden");
	ToggleClass("number-"+current.question,"current");
	current.question++;
	ToggleClass("number-"+current.question,"current");
	setTimeout(function() {
		loadQuestion();
		ToggleClass("question_data","hidden");
	},500);
}
function checkQuestions() {
	current.checkEnabled = !current.checkEnabled;
	ToggleClass('btn__check','active');
	ToggleClass('pass-all','hidden');
	var goodQuestions = 0;
	for (var i = 0; i < questions.length; i++) {
		if(questions[i].selected!=null){
			if(current.question == i+1){
				document.getElementById("number-"+(i+1)).className = 'round-number current';
			}else{
				document.getElementById("number-"+(i+1)).className = 'round-number';
			}
			if(current.checkEnabled){
				if(current.question == i+1){
					for (var z = 0; z < questions[i].options.length; z++) {
						if(questions[i].options[z].code == questions[i].correct){
							ToggleClass("radio-"+(z+1),"good");
						}
					}
					if(questions[i].selected.code != questions[i].correct){
						ToggleClass("radio-"+(questions[i].selected.id),"fail");
					}
				}
				if(questions[i].selected.code == questions[i].correct){
					goodQuestions++;
					ToggleClass("number-"+(i+1),"good");
				}else{
					ToggleClass("number-"+(i+1),"fail");
				}
			}else{
				ToggleClass("number-"+(i+1),"active");
				if(current.question == i+1){
					for (var z = 0; z < questions[i].options.length; z++) {
						document.getElementById("radio-"+(z+1)).className = 'question'+(questions[i].selected.id==z+1?' selected':'');
					}
				}
			}
		}
	}
	document.getElementById('puntaje-current').innerHTML = goodQuestions;
	if(goodQuestions>=current.puntaje){
		document.getElementById('puntaje-state').innerHTML = 'Usted <span style="color:#4caf50;">aprobó</span> el test';
	}else{
		document.getElementById('puntaje-state').innerHTML = 'Usted <span style="color:#FF5722;">reprobó</span> el test';
	}
}
function selectAnswer(id,code) {
	if(current.checkEnabled){
		return;
	}
	if(questions[current.question-1].selected!=null){
		ToggleClass("radio-"+questions[current.question-1].selected.id,"selected");
	}else{
		current.answered++;
		document.getElementById("progress_bar").style.width = (current.answered*calculateProgress)+'%';
		document.getElementById('answered').innerHTML = 'Respondidas '+current.answered+'/'+questions.length;
	}
	if(current.answered ==questions.length ){
		document.getElementById('btn__check').setAttribute('title','Haga click para calcular las respuestas');
		if(HasClass('btn__check','disabled')){
			ToggleClass('btn__check','disabled');
		}
		document.getElementById('btn__check').removeAttribute('disabled');
	}
	document.getElementById("number-"+current.question).className = 'round-number active current';
	ToggleClass("radio-"+id,"selected");
	questions[current.question-1].selected = {code:code,id:id};
}
function loadQuestion() {
	document.getElementById('btn_prev').removeAttribute('disabled');
	if(HasClass('btn_prev','disabled')){
		ToggleClass('btn_prev','disabled');
	}
	document.getElementById('btn_next').removeAttribute('disabled');
	if(HasClass('btn_next','disabled')){
		ToggleClass('btn_next','disabled');
	}
	if(current.question==1){
		ToggleClass('btn_prev','disabled');
		document.getElementById('btn_prev').setAttribute('disabled','disabled');
	}else if(current.question == questions.length){
		ToggleClass('btn_next','disabled');
		document.getElementById('btn_next').setAttribute('disabled','disabled');
	}
	document.getElementById('current_number').innerHTML = current.question;
	document.getElementById('question_text').innerHTML = questions[current.question-1].title;
	var que = '';
	for (var i = 0; i < questions[current.question-1].options.length; i++) {
		que += '<div class="question'+(questions[current.question-1].selected !=null?(questions[current.question-1].selected.id==(i+1)?' selected':''):'')+(questions[current.question-1].selected !=null && current.checkEnabled ?(questions[current.question-1].correct==questions[current.question-1].options[i].code?' good':''):'')+(questions[current.question-1].selected !=null && current.checkEnabled ?(questions[current.question-1].selected.code==questions[current.question-1].options[i].code && questions[current.question-1].selected.code!=questions[current.question-1].correct?' fail':''):'')+'" id="radio-'+(i+1)+'" onclick="selectAnswer('+(i+1)+',\''+questions[current.question-1].options[i].code+'\')"><span class="select_radio"></span> <span>'+questions[current.question-1].options[i].code+') '+questions[current.question-1].options[i].text+'</span></div>';
	}
	document.getElementById('form__quest').innerHTML = que;
}

var current = {
	question : 1,
	answered : 0,
	puntaje : 0,
	fullname : '',
	checkEnabled: false
};

var questions = [
	{
		title:'¿Cuál es el río más largo del mundo?',
		options: [
			{
				code: 'A',
				text: 'Rio Yangtsé'
			},
			{
				code: 'B',
				text: 'Rio Nilo'
			},
			{
				code: 'C',
				text: 'Rio Amazonas'
			},
			{
				code: 'D',
				text: 'Rio Misisipi'
			},
		],
		correct: 'C',
		selected: null
	},
	{
		title:'¿Dónde originaron los juegos olímpicos?',
		options: [
			{
				code: 'A',
				text: 'Italia'
			},
			{
				code: 'B',
				text: 'Grecia'
			},
			{
				code: 'C',
				text: 'Francia'
			},
			{
				code: 'D',
				text: 'Suiza'
			},
		],
		correct: 'B',
		selected: null
	},
	{
		title:'¿Qué cantidad de huesos en el cuerpo humano adulto?',
		options: [
			{
				code: 'A',
				text: '300'
			},
			{
				code: 'B',
				text: '209'
			},
			{
				code: 'C',
				text: '202'
			},
			{
				code: 'D',
				text: '206'
			},
		],
		correct: 'D',
		selected: null
	},
	{
		title:'¿Cuál fue el primer metal que empleó el hombre?',
		options: [
			{
				code: 'A',
				text: 'Cobre'
			},
			{
				code: 'B',
				text: 'Oro'
			},
			{
				code: 'C',
				text: 'Plata'
			},
			{
				code: 'D',
				text: 'Bronce'
			},
		],
		correct: 'A',
		selected: null
	},
	{
		title:'¿Quién pintó “la última cena”?',
		options: [
			{
				code: 'A',
				text: 'Leonardo da Vinci'
			},
			{
				code: 'B',
				text: 'Vincent van Gogh'
			},
			{
				code: 'C',
				text: 'Pablo Picasso'
			},
			{
				code: 'D',
				text: 'Salvador Dali'
			},
		],
		correct: 'A',
		selected: null
	},
	{
		title:'¿Cuál es el océano más grande?',
		options: [
			{
				code: 'A',
				text: 'Océano Atlántico'
			},
			{
				code: 'B',
				text: 'Océano Índico'
			},
			{
				code: 'C',
				text: 'Océano Pacífico'
			},
			{
				code: 'D',
				text: 'Océano Antártico'
			},
		],
		correct: 'C',
		selected: null
	},
	{
		title:'¿Cuál es el país más grande del mundo?',
		options: [
			{
				code: 'A',
				text: 'Estados Unidos'
			},
			{
				code: 'B',
				text: 'Canadá'
			},
			{
				code: 'C',
				text: 'Rusia'
			},
			{
				code: 'D',
				text: 'China'
			},
		],
		correct: 'C',
		selected: null
	},
	{
		title:'¿Cuál es el disco más vendido de la historia?',
		options: [
			{
				code: 'A',
				text: 'Back in Black - AC/DC'
			},
			{
				code: 'B',
				text: "Sgt. Pepper's Lonely Hearts Club Band - The Beatles"
			},
			{
				code: 'C',
				text: 'Thriller - Michael Jackson'
			},
			{
				code: 'D',
				text: 'The Wall - Pink Floyd'
			},
		],
		correct: 'C',
		selected: null
	},
	{
		title:'¿Cuál es la ciudad de los rascacielos?',
		options: [
			{
				code: 'A',
				text: 'New York'
			},
			{
				code: 'B',
				text: 'Dubai'
			},
			{
				code: 'C',
				text: 'Washington'
			},
			{
				code: 'D',
				text: 'Rio Misisipi'
			},
		],
		correct: 'A',
		selected: null
	},
	{
		title:'¿En qué año comenzó la II Guerra Mundial?',
		options: [
			{
				code: 'A',
				text: '1942'
			},
			{
				code: 'B',
				text: '1919'
			},
			{
				code: 'C',
				text: '1936'
			},
			{
				code: 'D',
				text: '1939'
			},
		],
		correct: 'D',
		selected: null
	}
];

document.getElementById('puntaje').setAttribute('max',questions.length);
document.getElementById('puntaje').setAttribute('title','Maximo puntaje '+questions.length);