<template>
  <div class="todo-list-view">
    <h2>To-Do List</h2>
    <form @submit.prevent="add">
      <input v-model="newTodo" placeholder="Add a new to-do" required />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <label>
          <input type="checkbox" v-model="todo.done" @change="toggle(todo.id)" />
          <span :class="{ done: todo.done }">{{ todo.text }}</span>
        </label>
        <button @click="remove(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTodoStore } from '../store/todo';

const todoStore = useTodoStore();
const newTodo = ref('');
const todos = todoStore.todos;

const add = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value.trim());
    newTodo.value = '';
  }
};
const toggle = (id) => todoStore.toggleTodo(id);
const remove = (id) => todoStore.removeTodo(id);
</script>

<style scoped>
.done { text-decoration: line-through; }
.todo-list-view { max-width: 400px; margin: 2rem auto; }
</style>
