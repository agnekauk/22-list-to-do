const url = 'http://localhost:5004';
const addNewToDo = document.querySelector('#add-new-todo');
const messageDiv = document.querySelector('.messages');

const messages = (message, status) => {
    let klase = (status === 'success') ? 'alert-success' : 'alert-danger';
    messageDiv.innerHTML = message;
    messageDiv.classList.remove('alert-success', 'alert-danger');
    messageDiv.classList.add('show', klase);
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 8000)
}

const getData = () => {
    fetch(url)
        .then(response => response.json())
        .then(response => {
            if (response.status === 'success') {
                html = '<ul>'

                response.data.forEach(value => {
                    let done = value.done ? 'done' : '';
                    html += `<li data-id='${value.id}'>
                    <input type='checkbox' class = 'checkbox mass-delete'>
                    <a class='mark-done ${done}'>${value.task}</a>
                    <i class="fa fa-pencil-square" aria-hidden="true"></i>
                    <a class='btn btn-outline-secondary delete-todo'>Delete</a>
                    </li>`
                })

                html += '</ul>'

                document.querySelector('#todos').innerHTML = html;

                document.querySelectorAll('.mark-done').forEach(element => {
                    let id = element.parentElement.getAttribute('data-id');
                    element.addEventListener('click', () => {
                        fetch(url + '/mark-done/' + id, {
                            method: "PUT",
                        })
                            .then(resp => resp.json())
                            .then(resp => {
                                if (resp.status === 'success') {
                                    getData();
                                }
                                messages(resp.message, resp.status);
                            })

                    })
                })
                document.querySelectorAll('.fa').forEach(element => {
                    let id = element.parentElement.getAttribute('data-id');

                    element.addEventListener('click', () => {
                        fetch(url + '/' + id, {
                        })
                            .then(resp => resp.json())
                            .then(resp => {
                                if (resp.status === 'success') {
                                    document.querySelector('#new-todo').value = resp.info.task;
                                    addNewToDo.textContent = addNewToDo.getAttribute('data-edit-label');
                                    addNewToDo.setAttribute('data-mode', 'edit');
                                    addNewToDo.setAttribute('element-id', id);
                                }
                            })
                    })
                })

                document.querySelectorAll('.delete-todo').forEach(element => {
                    let id = element.parentElement.getAttribute('data-id');

                    element.addEventListener('click', () => {
                        fetch(url + '/delete-todo/' + id, {
                            method: 'DELETE'
                        })
                            .then(resp => resp.json())
                            .then(resp => {
                                getData();
                                messages(resp.message, resp.status);
                            })
                    })
                })
            } else {
                messages(resp.message, resp.status);
            }
            let count = response.data.length;
            let tasksDone = 0;
            response.data.forEach(element => {
                if (element.done === true) {
                    tasksDone++;
                }
            })
            document.querySelector('.count').innerHTML = tasksDone + ' from ' + count + ' tasks done';
            let percentage = (tasksDone / count * 100).toFixed(0);
            document.querySelector('.bar').style.width = percentage + '%';
        })
}

getData();

addNewToDo.addEventListener('click', () => {
    let task = document.querySelector('#new-todo').value;
    let mode = addNewToDo.getAttribute('data-mode');

    let route = url + '/add-toDo';
    let method = 'POST';

    if (task === '') {
        let messages = document.querySelector('.messages');
        messages.innerHTML = 'Add a task';
        messages.classList.add('show');
        return
    }

    if (mode == "edit") {

        let id = addNewToDo.getAttribute('element-id');

        route = url + '/edit/' + id;
        method = 'PUT';

    }

    fetch(route, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
    })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.status === 'success') {
                getData();
            }
            document.querySelector('#new-todo').value = '';
            addNewToDo.setAttribute('data-mode', 'add');
            addNewToDo.textContent = addNewToDo.getAttribute('data-add-label');
            messages(resp.message, resp.status);
        })
})

document.querySelector('#mass-delete').addEventListener('click', () => {

    let ids = [];

    document.querySelectorAll('.mass-delete:checked').forEach(element => {
        ids.push(element.parentElement.getAttribute('data-id'));
    })
    fetch(url + '/mass-delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
    })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.status === 'success') {
                getData();
            }
            messages(resp.message, resp.status);
        })
})
