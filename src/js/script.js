// adding a new task
function add(storageText='', completed=false) {
    // error message to user
    const message = document.getElementById("message")
    message.innerHTML = ''
    let text = '';

    if(storageText !== '') { // if there is text in local storage, use it
        text = storageText        
    }
    else { // otherwise get the text from the 
        text = document.getElementById('to-do').value
    }

    // getting what user inputs
    if(text === '') { // making sure they enter something
        document.getElementById('message').textContent = "You need to enter something!"
        return
    }

    document.getElementById('to-do').value = '' // clearing the input from the user from the input box

    const list = document.getElementById("to-do-list") // getting unordered list
    const listItem = document.createElement('li') // creating each task
    listItem.id = "item"

    // creating checkbox for inside the task
    const checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.id = "checkbox"
    checkbox.className = "checkbox"
    checkbox.checked = completed

    // creating paragraph element for the actual task in list
    const textNode = document.createElement('p')
    textNode.textContent = text
    textNode.id = "list-content"

    // edit button in case user wants to edit their task
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit'
    editButton.className = "button"
    editButton.id = "edit-button"
    editButton.onclick = function() { // if edit clicked, create input box and change button
        const newInput = document.createElement('input')
        newInput.type = "text"
        newInput.id = "edit"
        newInput.className = "input-box"
        newInput.placeholder = "Change task..."
    
        const change = document.createElement('button')
        change.textContent = "Save"
        change.id = "change"
        change.class = "button"

        // if change clicked, remove the new input and edit button as well as change the task text
        change.onclick = function () {
            const newText = newInput.value // getting what user wants to change the task to
            if(newText === '') { // user needs to input something
                document.getElementById('message').textContent = "You need to enter something!"
                return
            }
            document.getElementById('message').textContent = '' // clearing the user error messages

            listItem.childNodes[1].textContent = newText // setting the task to be what the user wants to change it to
    
            listItem.removeChild(newInput)
            listItem.removeChild(change)
            saveTasksToLocalStorage(); // saving the new task to local storage
        }

        // adding pressing the enter key to be equivalent to clicking change button when input box focused
        document.addEventListener("keydown", function(keyEvent) {
            console.log("running")
            if(keyEvent.key === "Enter" && document.activeElement.id === "edit") {
                console.log("in if")
                keyEvent.preventDefault()
                const newText = newInput.value
                if(newText === '') {
                    document.getElementById('message').textContent = "You need to enter something!"
                    return
                }
                document.getElementById('message').textContent = ''

                listItem.childNodes[1].textContent = newText
                console.log(newText)
                console.log(listItem.childNodes)
                listItem.removeChild(newInput)
                listItem.removeChild(change)
                saveTasksToLocalStorage();
            }
        })

        // adding the new input box and change button
        listItem.appendChild(newInput)
        listItem.appendChild(change)
    }

    // adding the delete button
    const del = document.createElement('button')
    del.textContent = 'Delete'
    del.className = "button"
    del.id = "delete-button"
    del.onclick = function() { // removing the task if pressing the delete button
        list.removeChild(listItem)
        saveTasksToLocalStorage();
    }

    // adding every element of a task as well as the whole task to the unordered list
    listItem.appendChild(checkbox)
    listItem.appendChild(textNode)
    listItem.appendChild(del)
    listItem.appendChild(editButton)
    list.appendChild(listItem)

    // changing style of task if user says it's completed
    if(checkbox.checked) { // background goes green and puts a line through the text if checkbox is checked
        listItem.style.background = 'green'
        listItem.childNodes[1].style.textDecorationLine = 'line-through'
        listItem.childNodes[1].style.textDecorationThickness = '2px'
        listItem.removeChild(editButton) // have to remove the edit button
    }
    else { // background stays the original color otherwise
        listItem.style.background = '#306d7d'
        listItem.childNodes[1].style.textDecorationLine = 'none'
    }

    // changing the background color of the task if the checkbox is checked
    checkbox.addEventListener("change", function() {
        // changing style of task if user says it's completed
        if(checkbox.checked) { // background goes green and puts a line through the text if checkbox is checked
            listItem.style.background = 'green'
            listItem.childNodes[1].style.textDecorationLine = 'line-through'
            listItem.childNodes[1].style.textDecorationThickness = '2px'
            listItem.removeChild(editButton) // have to remove the edit button
        }
        else { // background stays the original color otherwise
            listItem.style.background = '#306d7d'
            listItem.childNodes[1].style.textDecorationLine = 'none'
            listItem.appendChild(editButton)
        }
        saveTasksToLocalStorage(); //save the edit to local storage
    })

    saveTasksToLocalStorage(); // save the whole task list to local storage
}

// saving tasks to local storage in a JSON file
function saveTasksToLocalStorage() {
    const tasks = []
    document.querySelectorAll('li').forEach(task => { // getting every task
        const taskText = task.querySelector('p').textContent // getting the text of the task
        const isCompleted = task.querySelector('#checkbox').checked // seeing if the task was completed or not
        tasks.push({ text: taskText, completed: isCompleted }) // putting the task into object format
    })
    localStorage.setItem('tasks', JSON.stringify(tasks)) // storing the tasks list in JSON format
}

document.addEventListener('DOMContentLoaded', function() { // event listener to retrieve the tasks in local storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [] // the retrieval of local storage tasks
    savedTasks.forEach(task => { // adding every local storage task to the on screen task list
        add(task.text, task.completed)
    })
})

// function for pressing enter key to be equivalent to clicking add button
function keyPress() {
    document.addEventListener("keydown", function(keyEvent) {
        if(keyEvent.key === "Enter" && document.activeElement.id === "to-do") {
            keyEvent.preventDefault()
            add()
        }
    })
}

keyPress()