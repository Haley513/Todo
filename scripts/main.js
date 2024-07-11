document.addEventListener("DOMContentLoaded", function () {
  const todoTitle = document.getElementById("todo-title");
  const todoDetails = document.getElementById("todo-details");
  const todoDeadline = document.getElementById("todo-deadline");
  const todoPriority = document.getElementById("todo-priority");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");

  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalDetails = document.getElementById("modal-details");
  const modalPriority = document.getElementById("modal-priority");
  const modalDeadline = document.getElementById("modal-deadline");
  const modalStatus = document.getElementById("modal-status");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function getpriorityValue(priority) {
    switch(priority) {
      case '높음': return 3;
      case '보통': return 2;
      case '낮음': return 1;
      default: return 0;
    }
  }

  function saveTodos() {
    localStorage.setItem("todos",JSON.stringify(todos));
  }

  function renderTodos() {
    todos.sort((a, b) => {
      const priorityDiff = getpriorityValue(b.priority) - getpriorityValue(a.priority);
      if (priorityDiff !== 0) return priorityDiff;
      if (a.deadline && b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (a.deadline) {
        return -1;
      } else if (b.deadline) {
        return 1;
      }
      return 0;
    });
      
      todoList.innerHTML = "";
      todos.forEach(function (todo, index) {
          const li = document.createElement("li");
          li.classList.add("list-item");
          if (todo.status === "completed") {
            li.classList.add("completed");
          } else {
            li.classList.remove("completed");
          }
          li.innerHTML = `
            <input type="checkbox" class="complete-checkbox checkbox" onchange="toggleComplete(${index})" ${todo.status === "completed" ? "checked" : ""}>
            <span class="todo-text" onclick="openModal(${index})">${todo.title} - ${todo.priority}</span>
            <div class="button-group">
              <button class="delete-btn" onclick="deleteTodo(${index})">X</button>
              </div>
            `;

            todoList.appendChild(li);
      });
  }

  function addTodo() {
    if (todoTitle.value.trim() === "" || todoDetails.value.trim() === "") {
      alert("제목과 세부내용을 입력하세요.");
      return;
    }

      const newTodo = {
        title: todoTitle.value,
        details: todoDetails.value,
        deadline: todoDeadline.value || null,
        priority: todoPriority.value,
        status: "pending"
      };
      todos.push(newTodo);
      saveTodos();
      renderTodos();
      clearInputs();
  }
  
  function clearInputs() {
    todoTitle.value = "";
    todoDetails.value = "";
    todoDeadline.value = "";
    todoPriority.value = "";

  }

  window.toggleComplete = function (index) {
    todos[index].status = todos[index].status === "completed" ? "pending" : "completed";
    saveTodos();
    renderTodos();
  };

  window.deleteTodo = function (index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  };

  window.openModal = function (index) {
    const todo = todos[index];
    modalTitle.textContent = `제목: ${todo.title}`;
    modalDetails.textContent = `세부내용: ${todo.details}`;
    modalPriority.textContent = `우선순위: ${todo.priority}`;
    modalDeadline.textContent = `마감날짜: ${todo.deadline ? todo.deadline : '없음'}`;
    modalStatus.textContent = `상태: ${todo.status === "completed" ? "완료됨" : "진행중"}`;
    modal.style.display = "block";
  };

  function closeModal() {
    modal.style.display = "none";
  }

  addTodoButton.addEventListener("click", addTodo);
  closeModalButton.addEventListener("click", function(event) {
    closeModal();
    event.stopPropagation();
  });

  window.onclick = function(event) {
    if (event.target === modal) {
      closeModal();
    }
  };

  renderTodos();
});
