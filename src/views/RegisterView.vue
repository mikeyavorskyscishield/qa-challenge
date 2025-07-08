<template>
  <div class="register-view">
    <h2>Register</h2>
    <form @submit.prevent="onRegister">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
    <p>Already have an account? <a @click.prevent="$emit('switch', 'login')" href="#">Login</a></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../auth/useAuth';

const username = ref('');
const password = ref('');
const { register, error } = useAuth();

const onRegister = async () => {
  await register(username.value, password.value);
};
</script>

<style scoped>
.register-view { max-width: 300px; margin: 2rem auto; }
.error { color: red; }
</style>
