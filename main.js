let tasks = []

function renderTasks() {
  const list = document.getElementById('task-list')

  list.innerHTML = ''

  tasks.forEach(task => {
    const li = document.createElement('li')

    li.textContent = task.title

    if (task.completed) {
      li.style.textDecoration = 'line-through'
    }

    list.appendChild(li)
  })
}

async function loadTasks() {
  const loading = document.getElementById('loading')
  const error = document.getElementById('error')

  loading.style.display = 'block'
  error.style.display = 'none'

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')

    if (!response.ok) {
      throw new Error('Erro na requisição')
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