document.addEventListener("DOMContentLoaded", function () {
  const todoTitle = document.getElementById("todo-title");
  const todoDetails = document.getElementById("todo-details");
  const todoPriority = document.getElementById("todo-priority");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");

  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalDetails = document.getElementById("modal-details");
  const modalPriority = document.getElementById("modal-priority");
  const modalStatus = document.getElementById("modal-status");

  let todos = [];

  function renderTodos() {
      todoList.innerHTML = "";
      todos.forEach(function (todo, index) {
          const li = document.createElement("li");
          li.className = todo.status === "completed" ? "completed" : "";
          li.innerHTML = `
            <span onclick="openModal(${index})">${todo.title} - ${todo.priority}</span>
            <div class="button-group">
              <button class="complete-btn" onclick="toggleComplete(${index})">${todo.status === "completed" ? "진행중" : "완료"}</button>
              <button class="delete-btn" onclick="deleteTodo(${index})">삭제</button>
              </div>
            `;

            const completeBtn = li.querySelector(".complete-btn");
            const styles = getComputedStyle(completeBtn);
            const paddingLeft = parseInt(styles.getPropertyValue('padding-left'),10);
            const paddingRight = parseInt(styles.getPropertyValue('padding-right'),10);
            const borderLeft = parseInt(styles.getPropertyValue('border-left-width'),10);
            const borderRight = parseInt(styles.getPropertyValue('border-right-width'),10);
            const totalWidth = completeBtn.offsetWidth + paddingLeft + paddingRight + borderLeft + borderRight;
            completeBtn.style.width = totalWidth + "px";

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
        priority: todoPriority.value,
        status: "pending"
      };
      todos.push(newTodo);
      renderTodos();
      clearInputs();
  }
  
  function clearInputs() {
    todoTitle.value = "";
    todoDetails.value = "";
    todoPriority.value = "낮음";

  }

  window.toggleComplete = function (index) {
    todos[index].status = todos[index].status === "completed" ? "pending" : "completed";
    renderTodos();
    const completeBtn = todoList.children[index].querySelector(".complete-btn");
    completeBtn.disabled = todos[index].status === "completed";
  };

  window.deleteTodo = function (index) {
    todos.splice(index, 1);
    renderTodos();
  };

  window.openModal = function (index) {
    const todo = todos[index];
    modalTitle.textContent = `제목: ${todo.title}`;
    modalDetails.textContent = `세부내용: ${todo.details}`;
    modalPriority.textContent = `우선순위: ${todo.priority}`;
    modalStatus.textContent = `상태: ${todo.status === "completed" ? "완료됨" : "진행중"}`;
    modal.style.display = "block";
  
  }

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
});
