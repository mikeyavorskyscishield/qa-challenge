<template>
  <div class="todo-list-view">
    <h2>To-Do List</h2>
    <form @submit.prevent="add">
      <input v-model="newTodo" placeholder="Add a new to-do" required />
      <button type="submit">Add</button>
    </form>
    <table class="todo-table">
      <thead>
        <tr>
          <th>Done</th>
          <th>Task</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="todo in todos" :key="todo.id">
          <td>
            <input
              type="checkbox"
              :checked="todo.done"
              @change="toggle(todo.id)"
            />
          </td>
          <td>
            <span :class="{ done: todo.done }">{{ todo.text }}</span>
          </td>
          <td>
            <span class="date">{{
              new Date(todo.createdAt).toLocaleString()
            }}</span>
          </td>
          <td>
            <button @click="remove(todo.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useTodoStore } from "../store/todo";

const todoStore = useTodoStore();
const newTodo = ref("");
const todos = todoStore.todos;

const add = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value.trim());
    newTodo.value = "";
  }
};
const toggle = (id) => todoStore.toggleTodo(id);
const remove = (id) => todoStore.removeTodo(id);
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
.todo-list-view {
  max-width: 600px;
  margin: 2rem auto;
}
.todo-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.todo-table th,
.todo-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
.todo-table th {
  background: #f5f5f5;
}
</style>
