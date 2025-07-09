import { ref } from "vue";
import { useUserStore } from "../store/user";

export function useAuth() {
  const userStore = useUserStore();
  const error = ref(null);
  const { setUser } = userStore;

  async function login(username, password) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Login failed");
    }
    const data = await res.json();
    setUser(data);
    return data;
  }

  async function register(username, password) {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Registration failed");
    }
    const data = await res.json();
    setUser(data);
    return data;
  }

  const logout = () => {
    userStore.logout();
  };

  return { login, register, logout, error };
}
