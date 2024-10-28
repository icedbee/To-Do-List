// add subheadings for different tasks
// 

// adding a new task
function add() {
    // error message to user
    const message = document.getElementById("message")
    message.innerHTML = ''

    // getting what user inputs
    const text = document.getElementById('to-do').value
    if(text === '') { // making sure they enter something
        document.getElementById('message').textContent = "You need to enter something!"
        return
    }

    document.getElementById('to-do').value = '' // deleting the input from the user from the input box

    const list = document.getElementById("to-do-list") // getting unordered list
    const listItem = document.createElement('li') // creating each task
    listItem.id = "item"

    // creating checkbox for inside the task
    const checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.id = "checkbox"
    checkbox.className = "checkbox"

    // changing the background color of the task if the checkbox is checked
    checkbox.addEventListener("click", function() {
        if(checkbox.checked) {
            listItem.style.background = 'green'
        }
        else {
            listItem.style.background = '#306d7d'
        }
    })

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
        change.textContent = "Change"
        change.id = "change"
        change.class = "button"
        // if chnage clicked, remove the new input and edit button as well as change the task text
        change.onclick = function () {
            const newText = newInput.value
            if(newText === '') {
                document.getElementById('message').textContent = "You need to enter something!"
                return
            }
            document.getElementById('message').textContent = ''

            listItem.childNodes[1].textContent = newText
    
            listItem.removeChild(newInput)
            listItem.removeChild(change)
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
    }

    // adding every element of a task as well as the whole task to the unordered list
    listItem.appendChild(checkbox)
    listItem.appendChild(textNode)
    listItem.appendChild(editButton)
    listItem.appendChild(del)
    list.appendChild(listItem)
}

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