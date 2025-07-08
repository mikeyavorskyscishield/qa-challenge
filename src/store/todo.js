import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([]);

  function addTodo(text) {
    todos.value.push({ id: Date.now(), text, done: false });
  }

  function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  function removeTodo(id) {
    todos.value = todos.value.filter(t => t.id !== id);
  }

  return { todos, addTodo, toggleTodo, removeTodo };
});
