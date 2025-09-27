<!-- src/App.vue -->
<template>
  <div class="app-container">
    <nav>
      <router-link to="/management">Management Assessment</router-link> |
      <router-link to="/self-assessment">HR Self Assessment</router-link> |
      <router-link to="/user-survey">User Survey (HOD)</router-link> |
      <router-link to="/admin-login">Admin Login</router-link>
    </nav>

    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
/* keep your same nav styles */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
nav {
  margin-bottom: 30px;
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}
nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}
nav a:hover {
  background-color: #e9ecef;
}
nav a.router-link-exact-active {
  font-weight: bold;
  color: white;
  background-color: #3498db;
}
</style>
