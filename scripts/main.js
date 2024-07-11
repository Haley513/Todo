document.addEventListener("DOMContentLoaded", function () {
  const todoTitle = document.getElementById("todo-title");
  const todoDetails = document.getElementById("todo-details");
  const todoDeadline = document.getElementById("todo-deadline");
  const todoPriority = document.getElementById("todo-priority");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");

  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-btn");
  const saveChangesButton = document.getElementById("save-changes");
  const editButton = document.getElementById("edit-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalDetails = document.getElementById("modal-details");
  const modalPriority = document.getElementById("modal-priority");
  const modalDeadline = document.getElementById("modal-deadline");
  const modalStatus = document.getElementById("modal-status");  
  const viewTitle = document.getElementById("view-title");
  const viewDetails = document.getElementById("view-details");
  const viewPriority = document.getElementById("view-priority");
  const viewDeadline = document.getElementById("view-deadline");
  const viewStatus = document.getElementById("view-status");

  const viewMode = document.getElementById("view-mode");
  const editMode = document.getElementById("edit-mode");  

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let currentIndex = null;

  function getpriorityValue(priority) {
    switch(priority) {
      case '높음': return 3;
      case '보통': return 2;
      case '낮음': return 1;
      default: return 0;
    }
  }

  function getpriorityStars(priority) {
    switch(priority) {
      case '높음': return '★★★';
      case '보통': return '★★';
      case '낮음': return '★';
      default: return '';
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
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

          let todoText = `${getpriorityStars(todo.priority)} ${todo.title}`;
          if (todo.deadline) {
            todoText += `  (${formatDate(todo.deadline)})`;
          }

          li.innerHTML = `
            <input type="checkbox" class="complete-checkbox checkbox" onchange="toggleComplete(${index})" ${todo.status === "completed" ? "checked" : ""}>
            <span class="todo-text" onclick="openModal(${index})">${todoText}</span>
            <div class="button-group">
              <button class="delete-btn" onclick="deleteTodo(${index})">x</button>
              </div>
            `;

            todoList.appendChild(li);
      });
  }

  function addTodo() {
    if (todoTitle.value.trim() === "" || todoDetails.value.trim() === "" || todoPriority.value === "") {
      alert("제목, 세부내용, 중요도는 필수 입력 항목입니다.");
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
    currentIndex = index;
  
    viewTitle.textContent = `${todo.title}`;
    viewTitle.style.fontSize = '20px';
    viewTitle.style.fontWeight = 'bold';
    viewDetails.textContent = `${todo.details}`;
    viewPriority.textContent = `우선순위: ${getpriorityStars(todo.priority)}`;
    viewDeadline.textContent = `마감날짜: ${todo.deadline ? formatDate(todo.deadline) : '없음'}`;
    viewStatus.textContent = `상태: ${todo.status === "completed" ? "완료됨" : "진행중"}`;
    
    modalTitle.value = todo.title;
    modalDetails.value = todo.details;
    modalPriority.value = todo.priority;
    modalDeadline.value = todo.deadline || '';
    modalStatus.value = todo.status;

    viewMode.style.display = "block";
    editMode.style.display = "none";
    modal.style.display = "block";

    editButton.classList.add('modal-button');
    saveChangesButton.classList.add('modal-button');

  };

  editButton.addEventListener("click", function () {
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
  });

  saveChangesButton.addEventListener("click", function () {
    if (currentIndex !== null) {
      todos[currentIndex].title = modalTitle.value;
      todos[currentIndex].details = modalDetails.value;
      todos[currentIndex].priority = modalPriority.value;
      todos[currentIndex].deadline = modalDeadline.value;
      todos[currentIndex].status = modalStatus.value;
      saveTodos();
      renderTodos();
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = "none";
    currentIndex = null;
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
