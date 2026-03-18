let tasks = []

let currentFilter = 'all'

function renderTasks() {
  const list = document.getElementById('task-list')

  list.innerHTML = ''

  let filteredTasks = tasks

  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed)
  }

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed)
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li')
    li.classList.add('task-item')

    const actions = document.createElement('div')
    actions.classList.add('task-actions')

    const span = document.createElement('span')
    span.classList.add('task-text')
    span.textContent = task.title

    span.addEventListener('click', () => {
      toggleTask(task.id)
    })

    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'

    editButton.addEventListener('click', () => {
      editTask(task.id, span)
    })

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'X'

    deleteButton.addEventListener('click', () => {
      deleteTask(task.id)
    })

    if (task.completed) {
      span.style.textDecoration = 'line-through'
    }

    actions.appendChild(editButton)
    actions.appendChild(deleteButton)

    li.appendChild(span)
    li.appendChild(actions)

    list.appendChild(li)
  })

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement('li')
    emptyMessage.textContent = 'Nenhuma tarefa encontrada.'
    list.appendChild(emptyMessage)
  }

  updateTaskCount()
  updateFilterButtons()
}

function deleteTask(id) {
  const confirmDelete = confirm('Tem certeza que deseja excluir esta tarefa?')

  if (!confirmDelete) return

  tasks = tasks.filter(task => task.id !== id)
  saveTasksToLocalStorage()
  renderTasks()
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed }
    }
    return task
  })

  saveTasksToLocalStorage()
  renderTasks()
}

function editTask(id, spanElement) {
  const input = document.createElement('input')
  input.value = spanElement.textContent

  spanElement.replaceWith(input)

  input.focus()

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit(id, input)
    }
  })

  input.addEventListener('blur', () => {
    saveEdit(id, input)
  })
}

function saveEdit(id, inputElement) {
  const newTitle = inputElement.value.trim()

  if (!newTitle) return

  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, title: newTitle }
    }
    return task
  })

  saveTasksToLocalStorage()
  renderTasks()
}

function updateTaskCount() {
  const taskCount = document.getElementById('task-count')

  if (taskCount) {
    taskCount.textContent = `Total de tarefas: ${tasks.length}`
  }
}

function updateFilterButtons() {
  const allButton = document.getElementById('filter-all')
  const pendingButton = document.getElementById('filter-pending')
  const completedButton = document.getElementById('filter-completed')

  allButton.classList.remove('active')
  pendingButton.classList.remove('active')
  completedButton.classList.remove('active')

  if (currentFilter === 'all') {
    allButton.classList.add('active')
  }

  if (currentFilter === 'pending') {
    pendingButton.classList.add('active')
  }

  if (currentFilter === 'completed') {
    completedButton.classList.add('active')
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasksFromLocalStorage() {
  const savedTasks = localStorage.getItem('tasks')
  const loading = document.getElementById('loading')

  if (savedTasks) {
    tasks = JSON.parse(savedTasks)

    tasks = tasks.map(task => ({
      ...task,
      id: String(task.id)
    }))

    renderTasks()

    if (loading) {
      loading.style.display = 'none'
    }

    return true
  }

  return false
}

async function loadTasks() {
  const loading = document.getElementById('loading')
  const error = document.getElementById('error')

  loading.style.display = 'block'
  error.style.display = 'none'

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')

    if (!response.ok) {
      throw new Error('Erro ao carregar tarefas')
    }

    const data = await response.json()

    tasks = data.map(task => ({
      ...task,
      id: String(task.id)
    }))

    saveTasksToLocalStorage()
    renderTasks()

  } catch (err) {
    error.style.display = 'block'
    console.error(err)
  } finally {
    loading.style.display = 'none'
  }
}

const hasLocalTasks = loadTasksFromLocalStorage()

if (!hasLocalTasks) {
  loadTasks()
}

async function addTask() {
  const input = document.getElementById('task-input')
  const button = document.getElementById('add-btn')
  const message = document.getElementById('message')
  const title = input.value

  if (message) {
    message.textContent = ''
  }

  if (!title.trim()) {
    if (message) {
      message.textContent = 'Digite uma tarefa antes de adicionar.'
    }
    return
  }

  button.disabled = true

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        completed: false
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao criar tarefa')
    }

    const newTask = await response.json()

    const taskWithUniqueId = {
      ...newTask,
      id: crypto.randomUUID()
    }

    tasks.unshift(taskWithUniqueId)
    saveTasksToLocalStorage()
    renderTasks()
    input.value = ''

  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error)
    if (message) {
      message.textContent = 'Erro ao adicionar tarefa.'
    }
  } finally {
    button.disabled = false
  }
}

document.getElementById('add-btn').addEventListener('click', addTask)

const taskInput = document.getElementById('task-input')

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTask()
  }
})

document.getElementById('filter-all').addEventListener('click', () => {
  currentFilter = 'all'
  renderTasks()
})

document.getElementById('filter-pending').addEventListener('click', () => {
  currentFilter = 'pending'
  renderTasks()
})

document.getElementById('filter-completed').addEventListener('click', () => {
  currentFilter = 'completed'
  renderTasks()
})

document.getElementById('clear-all').addEventListener('click', () => {
  tasks = []
  saveTasksToLocalStorage()
  renderTasks()
})