let arrUsers = []

function ajaxFetch(method, url, cb, options = null) {
    let data = null;
    let ct = "plain/text";
    if (options !== null) {
        if (options.header) {
            ct = options.header.value;
            data = options.data;
        }
    }
    const jqueryParameters = {}
    jqueryParameters.method = method;
    jqueryParameters.url = url;
    jqueryParameters.contentType = ct;
    jqueryParameters.data = data;
    $.ajax(jqueryParameters)
        .done(function (result, status, xhr) {
            cb(xhr)
        })
        .fail(function (xhr, status, error) {
            console.log("Error!!!", error)
            cb(xhr, 'Error ' + error);
        })
}

window.onload = function () {
    if (localStorage.getItem('users')) {
        arrUsers = JSON.parse(localStorage.getItem('users'))
        displayUsers()
    }
    else {
        let j = 0
        let inter = setInterval(() => {
            getUser()
            j++;
            if (j === 10) {
                clearinter()
            }
        }, 100);
        function clearinter() {
            clearInterval(inter)
        }
    }
    setInterval(() => {
        let url = "https://randomuser.me/api";
        ajaxFetch('GET', url, change20s);
    }, 20000);
}

function change20s(xhr) {
    if (!xhr.responseText) { return }
    jsonobj = JSON.parse(xhr.responseText)
    let newUser = {
        picture: jsonobj.results[0].picture.medium,
        gender: jsonobj.results[0].gender,
        name: jsonobj.results[0].name.first + ' ' + jsonobj.results[0].name.last,
        bookingAge: jsonobj.results[0].registered.age,
        email: jsonobj.results[0].email
    }
    arrUsers[0] = newUser
    localStorage.setItem('users', JSON.stringify(arrUsers))
    displayUsers()
}

function getUser() {
    let url = "https://randomuser.me/api";
    ajaxFetch('GET', url, addUser);
}

function addUser(xhr) {
    if (!xhr.responseText) { return }
    jsonobj = JSON.parse(xhr.responseText)
    let newUser = {
        picture: jsonobj.results[0].picture.medium,
        gender: jsonobj.results[0].gender,
        name: jsonobj.results[0].name.first + ' ' + jsonobj.results[0].name.last,
        bookingAge: jsonobj.results[0].registered.age,
        email: jsonobj.results[0].email
    }
    arrUsers.push(newUser)
    localStorage.setItem('users', JSON.stringify(arrUsers))
    displayUsers()
}

function displayUsers() {
    let str = ''
    for (i = 0; i < arrUsers.length; i++) {
        str += `<div class='cartUser'>
            <div><img src='${arrUsers[i].picture}'></div>
            <div>gender: ${arrUsers[i].gender}</div>
            <div id='name${i}'>name: ${arrUsers[i].name}</div>
            <div>Booking age: ${arrUsers[i].bookingAge}</div>
            <div id='email${i}'>email: ${arrUsers[i].email}</div>
            <br>
            <div id='edit${i}'>
                <button onclick='deleteUser(${i})'>Del</button>
                <button onclick="editUser(${i},'${arrUsers[i].name}','${arrUsers[i].email}')">Edit</button>
            </div>
            
        </div>`
    }
    document.getElementById('users').innerHTML = str
}

function deleteUser(index) {
    arrUsers.splice(index, 1)
    localStorage.setItem('users', JSON.stringify(arrUsers))
    displayUsers()
}

function editUser(index, name, email) {
    let namei = 'name' + index
    let emaili = 'email' + index
    let editi = 'edit' + index
    document.getElementById(namei).innerHTML = `name: <input type='text' value='${name}'>`
    document.getElementById(emaili).innerHTML = `email: <input type='text' value='${email}'>`
    document.getElementById(editi).innerHTML = `<button onclick="saveEdit(${index},'${namei}','${emaili}')">Save</button>
                                                <button onclick="displayUsers()">Cancel</button>`
}

function saveEdit(index, namei, emaili) {
    arrUsers[index].name = document.querySelector('#' + namei + ' input').value
    arrUsers[index].email = document.querySelector('#' + emaili + ' input').value
    localStorage.setItem('users', JSON.stringify(arrUsers))
    displayUsers()
}
