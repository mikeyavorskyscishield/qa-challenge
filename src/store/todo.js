import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTodoStore = defineStore("todo", () => {
  /**
   * @typedef {Object} Todo
   * @property {number} id
   * @property {string} text
   * @property {boolean} done
   * @property {string} createdAt
   * @property {string|null} scheduledAt
   */
  /** @type {import('vue').Ref<Todo[]>} */
  const todos = ref([]);

  async function fetchTodos(userId) {
    const res = await fetch(`/api/todos?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error("Failed to fetch todos");
    todos.value = await res.json();
  }

  async function addTodo(text, scheduledAt = null, userId = null) {
    if (!userId) throw new Error("User ID required");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, text, scheduledAt }),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    const todo = await res.json();
    todos.value.push(todo);
  }

  // Update todo (done state) via API
  async function toggleTodo(id) {
    const todo = todos.value.find((t) => t.id === id);
    if (!todo) return;
    const newDone = !todo.done;
    // Optimistically update UI
    todo.done = newDone;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
    } catch (e) {
      // Rollback UI if API fails
      todo.done = !newDone;
      throw e;
    }
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((t) => t.id !== id);
  }

  // Sorting state
  const sortBy = ref("createdAt");
  const sortDir = ref("desc");

  function setSort(key) {
    if (sortBy.value === key) {
      sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = key;
      sortDir.value = key === "text" ? "asc" : "desc";
    }
  }

  // Sorted todos
  const sortedTodos = computed(() => {
    const arr = Array.isArray(todos.value) ? [...todos.value] : [];
    return arr.sort((a, b) => {
      let result = 0;
      if (sortBy.value === "createdAt") {
        result = a.createdAt.localeCompare(b.createdAt);
      } else if (sortBy.value === "done") {
        result = a.done === b.done ? 0 : a.done ? 1 : -1;
      } else if (sortBy.value === "text") {
        result = a.text.localeCompare(b.text);
      }
      return sortDir.value === "asc" ? result : -result;
    });
  });

  const filteredSortedTodos = computed(() => {
    const now = new Date();
    if (filter.value === "current") {
      return sortedTodos.value.filter(
        (todo) => !todo.scheduledAt || new Date(todo.scheduledAt) <= now,
      );
    } else if (filter.value === "scheduled") {
      return sortedTodos.value.filter(
        (todo) => todo.scheduledAt && new Date(todo.scheduledAt) > now,
      );
    }
    return filteredSortedTodos.value;
  });

  // Filter state
  const filter = ref("current");

  function setFilter(value) {
    filter.value = value;
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    sortBy,
    sortDir,
    setSort,
    sortedTodos,
    filteredSortedTodos,
    fetchTodos,
    filter,
    setFilter,
  };
});
