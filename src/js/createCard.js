// createCard.js
export { createTodo };

const createTodo = (todoTitle, todoDescription, todoImg, todoUser, todoDateTime, todoId, todoColumn) => {
    const todoCase = document.createElement("div");
    todoCase.className = "card__todo";
    todoCase.dataset.trelloId = todoId;

    const cardTop = document.createElement("div");
    cardTop.className = "card_top";

    const todoTitleHead = document.createElement("h3");
    todoTitleHead.className = "card__todo-title title4";
    todoTitleHead.textContent = todoTitle;

    const todoDate = document.createElement("div");
    todoDate.className = "card__todo-title";
    todoDate.textContent = todoDateTime;

    const todoDescriptionCard = document.createElement("div");
    todoDescriptionCard.className = "todo-description";
    todoDescriptionCard.textContent = todoDescription;

    todoCase.append(cardTop);
    cardTop.append(todoTitleHead);
    cardTop.append(todoDate);
    todoCase.append(todoDescriptionCard);

    const cardBottom = document.createElement("div");
    cardBottom.className = "card_bottom";

    const user = document.createElement("div");
    user.className = "user";

    const todoAuthor = document.createElement("img");
    todoAuthor.className = "card__todo-author";
    todoAuthor.src = todoImg;

    const todoUserName = document.createElement("p");
    todoUserName.className = "todo__user-name";
    todoUserName.textContent = todoUser;

    const cardEdit = document.createElement("div");
    cardEdit.className = "card__todo-btns";

    const linkEdit = document.createElement("a");
    linkEdit.className = "card__todo-edit";
    const linkEditPicture = document.createElement("i");
    linkEditPicture.className = "edit icon";
    linkEditPicture.dataset.type = 'edit-card';

    const linkDelete = document.createElement("a");
    linkDelete.className = "card__todo-delete";
    const linkDeletePicture = document.createElement("i");
    linkDeletePicture.className = "trash alternate icon";
    linkDeletePicture.dataset.type = 'delete-one';

    todoCase.append(cardBottom);
    cardBottom.append(user);
    user.append(todoAuthor);
    user.append(todoUserName);
    cardBottom.append(cardEdit);
    cardEdit.append(linkEdit);
    cardEdit.append(linkDelete);
    linkEdit.append(linkEditPicture);
    linkDelete.append(linkDeletePicture);
    return todoCase;
}