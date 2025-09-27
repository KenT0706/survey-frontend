<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
    <div class="text-xl font-bold">HR Survey System</div>
    <ul class="flex space-x-6">
      <li>
        <router-link to="/management" class="hover:underline" active-class="font-bold underline">
          Management
        </router-link>
      </li>
      <li>
        <router-link to="/self-assessment" class="hover:underline" active-class="font-bold underline">
          HR Self-Assessment
        </router-link>
      </li>
      <li>
        <router-link to="/user-survey" class="hover:underline" active-class="font-bold underline">
          User Survey
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard" class="hover:underline" active-class="font-bold underline">
          Dashboard
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
</script>

<style scoped>
/* Optional: highlight active link */
.router-link-exact-active {
  color: #ffd700; /* gold highlight */
}
</style>
