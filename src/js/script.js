// add checkbox for each element of list to select each element
// add edit button
// add completed button (would have ✅ when completed and light up border green) 
// add uncomplete button (❌)
// add subheadings for different tasks
// 
function add() {
    const message = document.getElementById("message")
    message.innerHTML = ''

    const text = document.getElementById('to-do').value
    if(text === '') {
        alert("You need to enter something!")
        return
    }
    document.getElementById('to-do').value = ''

    const list = document.getElementById("to-do-list")
    const listItem = document.createElement('li')
    const checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    //checkbox.id = "check"

    const edit = document.createElement('button')
    edit.textContent = 'Edit'
    edit.onclick = function() {alert('Edit')}

    const del = document.createElement('button')
    del.textContent = 'Delete'
    del.onclick = function() {alert('Delete')}

    listItem.appendChild(checkbox)
    listItem.appendChild(document.createTextNode(text))
    listItem.appendChild(edit)
    listItem.appendChild(del)
    list.appendChild(listItem)
}

function del() {
    const message = document.getElementById("message")
    message.innerHTML = ''
    const text = document.getElementById('to-do').value
    const list = document.getElementById("to-do-list")
    let items = [...document.querySelectorAll("#to-do-list li")]
    console.log(text)
    console.log(items[0].innerHTML)

    let index = items.findIndex((element) => element.innerHTML === text)

    try {
        list.removeChild(items[index])
    }
    catch(err) {
        if(err instanceof TypeError) {
            message.innerHTML = `${text} not in list!`
        }     
        else {
            message.innerHTML = `Something went wrong, here is the error:\n
                                ${err}`
        }
    }
}

function edit() {

}

function keyPress() {
    document.addEventListener("keydown", function(event) {
        if(event.key === "Enter") {
            event.preventDefault()
            add()
        }
    })
}

keyPress()