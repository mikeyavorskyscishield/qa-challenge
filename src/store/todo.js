import { defineStore } from "pinia";
import { ref } from "vue";

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

  return { todos, addTodo, toggleTodo, removeTodo };
});
