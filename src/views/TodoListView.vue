<template>
  <div class="todo-list-view">
    <div class="header-row">
      <h2>To-Do List</h2>
      <button class="logout-link" @click="logout">Logout</button>
    </div>
    <div class="filter-row">
      <button
        type="button"
        :class="{ active: filter === 'current' }"
        @click="todoStore.setFilter('current')"
      >
        Show Current
      </button>
      <button
        type="button"
        :class="{ active: filter === 'scheduled' }"
        @click="todoStore.setFilter('scheduled')"
      >
        Show Scheduled
      </button>
    </div>
    <form @submit.prevent="add" class="todo-form flex-row">
      <div class="input-group">
        <label for="todo-task">Task</label>
        <input
          id="todo-task"
          v-model="newTodo"
          placeholder="Add a new to-do"
          required
        />
      </div>
      <div class="input-group">
        <label for="todo-scheduled">Scheduled</label>
        <SciSureDatePicker
          id="todo-scheduled"
          v-model="newScheduledAt"
          class="date-picker"
          :is-required="false"
          :min-date="new Date()"
          :masks="{ input: 'YYYY-MM-DD HH:mm' }"
          :input-props="{ placeholder: 'Schedule (optional)' }"
          :use-clear-button="true"
        />
      </div>
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
          <th
            @click="todoStore.setSort('scheduledAt')"
            :class="{ sortable: true, active: sortBy === 'scheduledAt' }"
          >
            Scheduled
            <span v-if="sortBy === 'scheduledAt'">{{
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
          </td>
          <td>
            <span class="date">{{
              new Date(todo.createdAt).toLocaleString()
            }}</span>
          </td>
          <td>
            <span v-if="todo.scheduledAt" class="date">{{
              new Date(todo.scheduledAt).toLocaleString()
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
import { ref, onMounted, computed } from "vue";
import { useTodoStore } from "../store/todo";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import SciSureDatePicker from "../components/SciSureDatePicker.vue";

const todoStore = useTodoStore();
const userStore = useUserStore();
const newTodo = ref("");
const newScheduledAt = ref(null);
const { filteredSortedTodos, todos, sortBy, sortDir, filter } =
  storeToRefs(todoStore);
const { user } = storeToRefs(userStore);

const add = async () => {
  if (newTodo.value.trim() && user.value?.id) {
    await todoStore.addTodo(
      newTodo.value.trim(),
      newScheduledAt.value,
      user.value.id,
    );
    newTodo.value = "";
    newScheduledAt.value = null;
  }
};

onMounted(() => {
  if (user.value?.id) {
    todoStore.fetchTodos(user.value.id);
  }
});

const logout = () => {
  userStore.logout();
  window.location.reload();
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
.filter-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.filter-row button {
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}
.filter-row button.active {
  background: #0074d9;
  color: #fff;
  border-color: #0074d9;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.logout-link {
  background: none;
  border: none;
  color: #0074d9;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}
</style>
