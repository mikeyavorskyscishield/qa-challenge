import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  function setUser(newUser) {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  function loadUser() {
    const saved = localStorage.getItem('user');
    if (saved) user.value = JSON.parse(saved);
  }

  return { user, setUser, logout, loadUser };
});
