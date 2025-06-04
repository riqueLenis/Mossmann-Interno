export let randomNum = Math.floor(Math.random() * 11) + 1;

export const userName = async() => {
        const response = await fetch('https://6824b71e0f0188d7e72a80e2.mockapi.io/api/v1/name')
        let users;
        return users = await response.json();
}

export const userAvatar = (randomNum) => {
    const mainDiv = document.getElementById('menu');

    const div = document.createElement('div');
    div.className = 'item';

    let divAtr = document.createAttribute('data-value');
    div.setAttributeNode(divAtr);

    const todoImg = document.createElement("img");
    todoImg.className = "ui mini avatar image";


    let imgAtr = document.createAttribute('src');
    imgAtr.value = (`https://api.dicebear.com/9.x/pixel-art/${randomNum}svg`);
    todoImg.setAttributeNode(imgAtr);

    div.append(todoImg);
    mainDiv.append(div);

    return div
}

export const userAvatarEdit = (randomNum) => {
    const editDiv = document.getElementById('menu-edit');
    const divEdit = document.createElement('div');

    divEdit.className = 'item';
    let divAtrEdit = document.createAttribute('data-value');
    divEdit.setAttributeNode(divAtrEdit);

    const todoImgEdit = document.createElement("img");
    todoImgEdit.className = "ui mini avatar image";
    let imgEditAtr = document.createAttribute('src');
    imgEditAtr.value = (`https://api.dicebear.com/9.x/pixel-art/${randomNum}svg`);
    todoImgEdit.setAttributeNode(imgEditAtr);

    divEdit.append(todoImgEdit)
    editDiv.append(divEdit);

    return divEdit
}