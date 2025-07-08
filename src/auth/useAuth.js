import { ref } from 'vue';
import { useUserStore } from '../store/user';

export function useAuth() {
  const userStore = useUserStore();
  const error = ref(null);

  const login = async (username, password) => {
    // Simple demo: username === password
    if (username && password && username === password) {
      userStore.setUser({ username });
      error.value = null;
      return true;
    } else {
      error.value = 'Invalid credentials';
      return false;
    }
  };

  const register = async (username, password) => {
    // In a real app, call an API
    if (username && password) {
      userStore.setUser({ username });
      error.value = null;
      return true;
    } else {
      error.value = 'Please provide username and password';
      return false;
    }
  };

  const logout = () => {
    userStore.logout();
  };

  return { login, register, logout, error };
}
