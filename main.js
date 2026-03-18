let tasks = []

function renderTasks() {
  const list = document.getElementById('task-list')

  list.innerHTML = ''

  tasks.forEach(task => {
    const li = document.createElement('li')

    const span = document.createElement('span')
  span.textContent = task.title

    const button = document.createElement('button')
  button.textContent = 'X'

  button.addEventListener('click', () => {
    deleteTask(task.id)
  })

    if (task.completed) {
      li.style.textDecoration = 'line-through'
    }

    list.appendChild(span)
    list.appendChild(button)
  })
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id)
    renderTasks()
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
  const title = input.value

  if (!title.trim()) return

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
  } finally {
    button.disabled = false
  }
}



document.getElementById('add-btn').addEventListener('click', addTask)