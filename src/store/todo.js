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

  function addTodo(text, scheduledAt = null) {
    todos.value.push({
      id: Date.now(),
      text,
      done: false,
      createdAt: new Date().toISOString(),
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    });
  }

  function toggleTodo(id) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
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

  // Filtered sorted todos (exclude future scheduled)
  const filteredSortedTodos = computed(() => {
    const now = new Date();
    return sortedTodos.value.filter((todo) => {
      if (!todo.scheduledAt) return true;
      return new Date(todo.scheduledAt) <= now;
    });
  });

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
  };
});
