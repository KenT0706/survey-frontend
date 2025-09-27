<!-- src/views/AdminLogin.vue -->
<template>
  <div class="login-container">
    <h2>Admin Login</h2>
    <form @submit.prevent="loginAdmin">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "AdminLogin",
  data() {
    return {
      username: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async loginAdmin() {
      try {
        const res = await axios.post("/auth?action=login", {
          username: this.username,
          password: this.password
        });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          this.$router.push("/dashboard");
        } else {
          this.error = res.data.message || "Login failed";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed. Please try again.";
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #2980b9;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>