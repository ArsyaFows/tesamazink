<template>
  <!-- Navbar -->
  <header 
  :style="{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }" 
  class="shadow-sm border-b fixed top-0 left-0 right-0 z-20"
>
    <div class="px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img src="../assets/vue.svg" alt="Logo" class="w-8 h-8"/>
        <h1 class="text-2xl font-bold" :class="darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'">
          Admin Panel
        </h1>
      </div>

      <div class="flex items-center gap-4">
  <!-- Button menu (mobile only) -->
  <button @click="toggleMenu" class="md:hidden p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">
    ☰
  </button>

  <!-- Logout desktop -->
  <button 
    @click="$emit('logout')" 
    class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition hidden md:block">
    🔒 Logout
  </button>

  <!-- Dark/Light desktop -->
  <button 
    @click="toggleDarkMode" 
    class="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hidden md:block">
    {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
  </button>
</div>

    </div>

<!-- Dropdown menu mobile -->
<div 
  v-if="menuOpen" 
  class="md:hidden shadow-xl rounded-b-xl overflow-hidden animate-fadeIn"
  :style="{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }"
>

  <nav class="flex flex-col divide-y" :style="{ borderColor: 'var(--border-color)' }">
    <router-link 
      @click="menuOpen = false" 
      to="/users" 
      class="flex items-center gap-3 px-5 py-4 transition-all duration-200"
      :style="{ borderColor: 'var(--border-color)' }"
    >
      <span class="text-lg">👥</span>
      <span class="font-medium">Users</span>
    </router-link>

    <router-link 
      @click="menuOpen = false" 
      to="/products" 
      class="flex items-center gap-3 px-5 py-4 transition-all duration-200"
      :style="{ borderColor: 'var(--border-color)' }"
    >
      <span class="text-lg">🛍️</span>
      <span class="font-medium">Products</span>
    </router-link>

    <!-- Dark/Light Mobile -->
    <button 
      @click="toggleDarkMode(); menuOpen = false" 
      class="flex items-center gap-3 w-full text-left px-5 py-4 transition-all duration-200 font-medium"
      :style="{ borderColor: 'var(--border-color)' }"
    >
      <span class="text-lg">{{ darkMode ? '☀️' : '🌙' }}</span>
      <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
    </button>

    <!-- Logout Mobile -->
    <button 
      @click="$emit('logout'); menuOpen = false" 
      class="flex items-center gap-3 w-full text-left px-5 py-4 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 font-medium"
      :style="{ borderColor: 'var(--border-color)' }"
    >
      <span class="text-lg">🔒</span>
      <span>Logout</span>
    </button>
  </nav>
</div>


  </header>

  <!-- Sidebar desktop -->
  <aside 
  :style="{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }" 
  class="w-64 shadow-md border-r fixed top-0 bottom-0 pt-20 hidden md:block"
>
  <nav class="flex flex-col space-y-2 px-4">
    <router-link to="/users" class="px-4 py-3 rounded-lg font-medium transition" 
      :class="darkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-blue-50 hover:text-blue-700'" 
      active-class="bg-blue-100 text-blue-800 font-semibold">
      👥 Users
    </router-link>
    <router-link to="/products" class="px-4 py-3 rounded-lg font-medium transition" 
      :class="darkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-green-50 hover:text-green-700'" 
      active-class="bg-green-100 text-green-800 font-semibold">
      🛍️ Products
    </router-link>
  </nav>
</aside>


  <!-- Main content -->
  <main :style="{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }" class="flex-1 mt-10 p-6 md:ml-64">
    <slot/>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const menuOpen = ref(false);
const darkMode = ref(false);
const windowWidth = ref(window.innerWidth);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;

  if (darkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
};


const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value >= 1100) menuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);

  // cek localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  darkMode.value = savedTheme === 'dark';
});

</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
