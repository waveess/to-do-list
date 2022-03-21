//variable to hold all the lists
const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

//clear completed tasks
clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

//deleting a list
deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
})

newListForm.addEventListener('submit', e => {
    //prevent the page from refreshing everytime you hit enter
    e.preventDefault()
    const listName = newListInput.value;
    if(listName == null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list)
    saveAndRender()
})

//new task form

newTaskForm.addEventListener('submit', e => {
    //prevent the page from refreshing everytime you hit enter
    e.preventDefault()
    const taskName = newTaskInput.value;
    if(taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

//render the list name that the user types
function createList(name) {
   return { id: Date.now().toString(), name: name, tasks: [] }
}

//render tasks
function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
    save()
    render()
}
//saving list names to local storage
function save() {
    localStorage.setItem( LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

//render the lists
function render() {
    clearElement(listsContainer)
   renderLists()

   const selectedList = lists.find(list => list.id === selectedListId)
   if(selectedListId == null) {
       listDisplayContainer.style.display = 'none'
   } else {
       listDisplayContainer.style.display = '';
       listTitleElement.innerText = selectedList.name;
       renderTaskCount(selectedList);
       clearElement(tasksContainer);
       renderTasks(selectedList);
   }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement);

    })
}

// render the number of incomplete tasks
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => 
        !task.complete).length;
        const taskString = incompleteTaskCount === 1 ? "task": "tasks";
        listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining.`
}

function renderLists() {
    lists.forEach(list => {

        //html element type which in this case is a list
        const listElement = document.createElement('li');
        //the data attribute will allow us to know which list is being selected
        listElement.dataset.listId = list.id;
        //the class given to the list attribute in the html file
        listElement.classList.add("list-name");
        //displaying the name of the list
        listElement.innerText = list.name;
        //displaying the selected list
        if(list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        //appending this to the listContainer defined above
        listsContainer.appendChild(listElement);
    })
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}  

render();