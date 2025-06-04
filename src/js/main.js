import {swiperMode} from './responsive.js'
import {createTodo} from './createCard.js'
import {randomNum, userAvatar, userAvatarEdit, userName} from './usersGenerate.js'

window.addEventListener('load', function() {
	swiperMode();
});


window.addEventListener('resize', function() {
	swiperMode();
});

//geração de divs
for (let i = 0; i < 11; i++) {
	userAvatar(i);
	userAvatarEdit(i)
}

//criaçao de models
let userArr = document.getElementById('menu').children;
let userArrEdit = document.getElementById('menu-edit').children;


userName().then(users => {
	let newArr = users.map(user => user.name);
	let data
	for (let i = 0; i < userArr.length; i++) {
			data = newArr[i].split(' ').join('_');
			if(data.includes('.')){
				data = data.split('.').join('_');
			}
			userArr[i].dataset.value = data;
			userArrEdit[i].dataset.value = data;
			userArr[i].append(newArr[i])
			userArrEdit[i].append(newArr[i])
	}
});

//antes salvava no navegador
/*const storage = {
	getDataByKey: function (key) {
		if (localStorage.getItem(key) !== null) {
			return JSON.parse(localStorage.getItem(key));
		} else {
			return [];
		}
	},
	pushDataByKey: function (key, data) {
		let dataByKey = this.getDataByKey(key);
		dataByKey = [...dataByKey, data];
		localStorage.setItem(key, JSON.stringify(dataByKey));
	},
};*/

let todos =  [];

const inProgressColumn = document.querySelector('.dashboard__cards-inProgress');
const cardTodoColumn = document.querySelector('.dashboard__cards-todo');
const doneColumn = document.querySelector('.dashboard__cards-done');

//req cards acmossmann
const checkTodos = () => {
    fetch('https://acmossmann.com.br/cards')
        .then(res => res.json())
        .then(cards => {
            for (const card of cards) {
                const horaFormatada = new Date(card.horario).toLocaleString('pt-BR', {
                    timeZone: 'America/Campo_Grande'
                });
                const el = createTodo(
                    card.titulo,
                    card.descricao,
                    card.avatar,
                    card.autor,
                    horaFormatada,
                    card.id,
                    card.coluna
                );

                if (+card.coluna === +cardTodoColumn.dataset.columnId) {
                    cardTodoColumn.append(el);
                } else if (+card.coluna === +inProgressColumn.dataset.columnId) {
                    inProgressColumn.append(el);
                } else if (+card.coluna === +doneColumn.dataset.columnId) {
                    doneColumn.append(el);
                }
            }
        })
        .catch(err => console.error('Erro ao carregar card do banco', err));
}

// DragNDrop
let containerTdo = document.querySelector('.dashboard__cards-todo');
let containerInProgress = document.querySelector('.dashboard__cards-inProgress');
let containerDone = document.querySelector('.dashboard__cards-done');
const root = document.getElementById('root');

let drake = dragula([containerTdo, containerInProgress, containerDone]);

drake.on('drop', function(el, target, source, sibling) {
   if (target === containerInProgress && target.children.length >= 6) {
      $('.ui.modal.pop-up__inprogress').modal({blurring: true}, {observeChanges: true}).modal('show')
   }
	const cardId = el.dataset.trelloId;
	const novaColuna = target.dataset.columnId;

	fetch(`https://acmossmann.com.br/cards/${cardId}`,{
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ coluna: novaColuna })
	})
	.then(res => {
		if (!res.ok) throw new Error('falha ao atualizar coluna card');
	})
	.catch(err => console.error('Erro ao mover card:', err));
});

//pesquisa
const searchModul = document.querySelectorAll('.search__box');

searchModul.forEach(it => {
	it.addEventListener('keyup', (event) => {
		const searchModul = event.target;
		const todosArr = document.querySelectorAll('.card__todo');
		let input = searchModul.value;
		input = input.toLowerCase();

		for (const item of todosArr) {
			if (!item.textContent.toLowerCase().includes(input)){
				item.style.display = 'none';
			} else {
				item.style.display = 'block';
			}
		}
	});
});

//add novos cards
const TodoConstructor = function (todoTitle, todoDescription, todoImg, todoUser, todoId, todoColumn) {
	this.todoTitle = todoTitle;
	this.todoDescription = todoDescription;
	this.todoImg = todoImg;
	this.todoUser = todoUser;
	this.todoId = todoId;
	this.todoColumn = todoColumn;
}

//get access
const approveBtn = document.getElementById("approveBtn");
const cardTodo = document.getElementById("todoCase");
const inputTitle = document.getElementById('inputTitle');
const inputDescription = document.getElementById('inputDescription');

//abre e add modals
const btnAdd = document.getElementById('btn-add');
btnAdd.addEventListener('click', () => {
	inputTitle.value = '';
	inputDescription.value = '';
	$('#modal_add').modal({ blurring: true }, { allowMultiple: true}).modal('show').modal({
		onApprove : function() {
			$('#form-add').submit();
			return false;
		}})

	let formSettings = {
			onSuccess : function()
			{
				$('.modal').modal('hide');
			}
	}
	$('#form-add').form(formSettings);
	$('.ui.dropdown').dropdown('restore defaults');
})

//criando card
approveBtn.addEventListener('click', () => {
    if (inputTitle.value === '' || inputDescription.value === '') {
        $('#form-add').form({
            fields: {
                title: 'empty',
                description: 'empty',
            }
        });
        return;
    }
    const currentUser = $('#selection').dropdown('get value');
    let currentName = currentUser.split(' ').join('_').replaceAll('.', '_');
    const el = document.querySelector(`[data-value=${currentName}]`);
    const userImage = el.firstChild.src;
    const todoUser = el.textContent;
    const horario = new Date().toISOString();
    const column = "1";

    fetch('https://acmossmann.com.br/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: inputTitle.value,
            descricao: inputDescription.value,
            autor: todoUser,
            horario,
            avatar: userImage,
            coluna: column
        })
    })
    .then(res => res.json())
    .then(data => {
        const horaFormatada = new Date(data.horario).toLocaleString('pt-BR', {
            timeZone: 'America/Campo_Grande'
        });
        cardTodo.append(createTodo(
            data.titulo,
            data.descricao,
            data.avatar,
            data.autor,
            horaFormatada,
            data.id,
            data.coluna
        ));
    })
    .catch(err => console.error('Erro ao salvar card:', err));
});

//popUps
checkTodos();

let btnDeleteAll = document.querySelector('.btn__delete');
let btnDeleteConfirm = document.querySelector('.btn--dark');
let dashboardDone = document.querySelector('.dashboard__cards-done');

root.addEventListener('click', (event) => {
	const currentTrello = event.target.closest('.card__todo');
	if (!currentTrello) return;
	fetch(`https://acmossmann.com.br/cards/${currentTrello.dataset.trelloId}`, {
		method: 'DELETE'
	})
	.then(res => {
		if (!res.ok) throw new Error('Erro ao deletar card');
		currentTrello.remove();
	})
	.catch(err => console.error('Erro ao deletar card', err));

	if (event.target.dataset.type === 'edit-card') {
		const inputTitle = document.getElementById('title-edit');
		const inputDescription = document.getElementById('desc-edit');
		const editBtn = document.getElementById('editBtn');
		const clicked = event.target.closest('.card__todo');
		const clickedName = clicked.querySelector('.todo__user-name').textContent;
		let currentName = clickedName.split(' ').join('_');
		if(currentName.includes('.')){
			currentName = currentName.split('.').join('_');
		}

		let dropdownDefault = document.querySelector(`[data-value = ${currentName}]`).firstChild;
		let img = dropdownDefault.src

		$('#modal_edit').modal({blurring: true}, {allowMultiple: true}).modal('show').modal({
			onApprove : function() {
				$('#form-edit').submit();
				return false;
			}})
		let formSettings = {
			onSuccess : function()
			{
				$('#modal_edit').modal('hide');
			}
		}
		$('#form-edit').form(formSettings);

		$('.ui.dropdown').dropdown('set text', `<img class="ui mini avatar image" src= ${img}> ${clickedName}`)
		let elCurrent = document.querySelector(`[data-value = ${currentName}]`);
		let changedVal = elCurrent;

		$('#dropdown-edit').dropdown({
			'set value': `${clickedName}`,
			onChange: function (value1) {
				changedVal = value1;
				console.log(changedVal)
				return changedVal;
			}
		});

		inputTitle.value = clicked.querySelector('.card__todo-title').textContent;
		inputDescription.value = clicked.querySelector('.todo-description').textContent;

		let clickedImg = clicked.querySelector('.card__todo-author');
		let clickedUser = clicked.querySelector('.todo__user-name');

		editBtn.addEventListener ('click', () => {
			if (inputTitle.value === '' && inputDescription.value === ''){
				$('#form-edit').form({
					fields: {
						title: 'empty',
						description: 'empty',
					},
				})
			} else if (inputTitle.value === '') {
				$('#form-edit').form({
					fields: {
						title: 'empty',
					}
				})
			} else if (inputDescription.value === ''){
				$('#form-edit').form({
					fields: {
						description: 'empty'
					}
				})
			} else {
				clicked.querySelector('.card__todo-title').textContent = inputTitle.value;
				clicked.querySelector('.todo-description').textContent = inputDescription.value;

				if (changedVal !== elCurrent) {
					let extractImg = document.querySelector(`[data-value = ${changedVal}]`);
					clickedImg.src = extractImg.querySelector('.ui.mini.avatar.image').src;
					clickedUser.textContent = extractImg.textContent;

				} else {
					clickedImg.src = elCurrent.querySelector('.ui.mini.avatar.image').src;
					clickedUser.textContent = elCurrent.textContent;
				}
				fetch(`https://acmossmann.com.br/cards/${clicked.dataset.trelloId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						titulo: inputTitle.value,
						descricao: inputDescription.value,
						autor: clickedUser.textContent,
						avatar: clickedImg.src
					})
				})
				.then(res => {
					if (!res.ok) throw new Error('Falha ao editar card');
				})
				.catch(err => console.error('Erro ao editar card:', err));
			}
		})
	}
})

btnDeleteConfirm.addEventListener("click", (event) => {
    $('.ui.modal.pop-up__delete-all').modal({blurring: true}).modal('show');
    
    fetch(`https://acmossmann.com.br/cards/finalizados`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao deletar finalizados');
        dashboardDone.innerHTML = '';
    })
    .catch(err => console.error('Erro ao deletar finalizados', err));
});

btnDeleteAll.addEventListener("click", (event) => {
	if (containerDone.children.length) {
		$('.ui.modal.pop-up__delete-all').modal({blurring: true}).modal('show');
	} else {
		return containerDone;
	}
})