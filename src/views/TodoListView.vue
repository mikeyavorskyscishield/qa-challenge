<template>
  <div class="todo-list-view">
    <h2>To-Do List</h2>
    <form @submit.prevent="add" class="todo-form flex-row">
      <input v-model="newTodo" placeholder="Add a new to-do" required />
      <SciSureDatePicker
        v-model="newScheduledAt"
        class="date-picker"
        :is-required="false"
        :min-date="new Date()"
        :masks="{ input: 'YYYY-MM-DD HH:mm' }"
        :input-props="{ placeholder: 'Schedule (optional)' }"
        :use-clear-button="true"
      />
      <button type="submit">Add</button>
    </form>
    <table class="todo-table">
      <thead>
        <tr>
          <th
            @click="todoStore.setSort('done')"
            :class="{ sortable: true, active: sortBy === 'done' }"
          >
            Done
            <span v-if="sortBy === 'done'">{{
              todoStore.sortDir === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th
            @click="todoStore.setSort('text')"
            :class="{ sortable: true, active: sortBy === 'text' }"
          >
            Task
            <span v-if="sortBy === 'text'">{{
              todoStore.sortDir === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th
            @click="todoStore.setSort('createdAt')"
            :class="{ sortable: true, active: sortBy === 'createdAt' }"
          >
            Created
            <span v-if="sortBy === 'createdAt'">{{
              todoStore.sortDir === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="todo in filteredSortedTodos" :key="todo.id">
          <td>
            <input
              type="checkbox"
              :checked="todo.done"
              @change="toggle(todo.id)"
            />
          </td>
          <td>
            <span :class="{ done: todo.done }">{{ todo.text }}</span>
            <span v-if="todo.scheduledAt" class="scheduled"
              >(Scheduled:
              {{ new Date(todo.scheduledAt).toLocaleString() }})</span
            >
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
import { storeToRefs } from "pinia";
import SciSureDatePicker from "../components/SciSureDatePicker.vue";

const todoStore = useTodoStore();
const newTodo = ref("");
const newScheduledAt = ref(null);
const { filteredSortedTodos, todos, sortBy, sortDir } = storeToRefs(todoStore);

const add = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value.trim(), newScheduledAt.value);
    newTodo.value = "";
    newScheduledAt.value = null;
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

.flex-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.date-picker {
  min-width: 180px;
}
</style>
