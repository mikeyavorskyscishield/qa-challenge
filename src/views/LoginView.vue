<template>
  <div class="login-view">
    <h2>Login</h2>
    <form @submit.prevent="onLogin">
      <input v-model="username" placeholder="Username" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
    <p>
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../auth/useAuth";

const username = ref("");
const password = ref("");
const { login, error } = useAuth();
const router = useRouter();

const onLogin = async () => {
  const success = await login(username.value, password.value);
  if (success) {
    router.push("/");
  }
};
</script>

<style scoped>
.login-view {
  max-width: 300px;
  margin: 2rem auto;
}
.error {
  color: red;
}
</style>
