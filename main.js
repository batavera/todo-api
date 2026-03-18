let tasks = []

function renderTasks() {
  const list = document.getElementById('task-list')

  list.innerHTML = ''

  tasks.forEach(task => {
    const li = document.createElement('li')

    const span = document.createElement('span')
    span.textContent = task.title

    span.addEventListener('click', () => {
      editTask(task.id, span)
    })

    const button = document.createElement('button')
    button.textContent = 'X'

    button.addEventListener('click', () => {
      deleteTask(task.id)
    })

    if (task.completed) {
      li.style.textDecoration = 'line-through'
    }

    li.appendChild(span)
    li.appendChild(button)

    list.appendChild(li)
  })
    updateTaskCount()
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id)
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

  renderTasks()
}

function updateTaskCount() {
  const taskCount = document.getElementById('task-count')
  taskCount.textContent = `Total de tarefas: ${tasks.length}`
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

    tasks = data
    renderTasks()

  } catch (err) {
    error.style.display = 'block'
    console.error(err)
  } finally {
    loading.style.display = 'none'
  }
}

loadTasks()

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

    tasks.unshift(newTask)
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