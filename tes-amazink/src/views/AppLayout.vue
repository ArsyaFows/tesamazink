<template>
    
      <!-- Navbar -->
      <header class="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-20">
        <div class="px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img src="../assets/vue.svg" alt="Logo" class="w-8 h-8"/>
            <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Admin Panel
            </h1>
          </div>
  
          <div class="flex items-center gap-4">
            <!-- Hamburger menu untuk mobile -->
            <button @click="toggleMenu" class="md:hidden p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">
              ☰
            </button>
            <button @click="$emit('logout')" class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition hidden md:block">🔒 Logout</button>
          </div>
        </div>
  
        <!-- Dropdown menu mobile -->
        <div
  v-if="menuOpen"
  class="md:hidden bg-white border-t border-gray-200 shadow-xl rounded-b-xl overflow-hidden animate-fadeIn"
>
  <nav class="flex flex-col">
    <router-link
      @click="menuOpen = false"
      to="/users"
      class="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border-b border-gray-100 last:border-0"
    >
      <span class="text-lg">👥</span>
      <span class="font-medium">Users</span>
    </router-link>

    <router-link
      @click="menuOpen = false"
      to="/products"
      class="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 border-b border-gray-100"
    >
      <span class="text-lg">🛍️</span>
      <span class="font-medium">Products</span>
    </router-link>

    <button
      @click="$emit('logout'); menuOpen = false"
      class="flex items-center gap-3 w-full text-left px-5 py-4 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 font-medium"
    >
      <span class="text-lg">🔒</span>
      <span>Logout</span>
    </button>
  </nav>
</div>

      </header>
  
      <!-- Sidebar untuk desktop -->
      <aside class="w-64 bg-white shadow-md border-r fixed top-20 left-0 bottom-0 z-10 pt-4 hidden md:block">
        <nav class="flex flex-col space-y-2 px-4">
          <router-link to="/users" class="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition" active-class="bg-blue-100 text-blue-800 font-semibold">👥 Users</router-link>
          <router-link to="/products" class="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium transition" active-class="bg-green-100 text-green-800 font-semibold">🛍️ Products</router-link>
        </nav>
      </aside>
  
      <!-- Main content -->
      <main class="flex-1 mt-10 p-6 md:ml-64">
        <slot/>
      </main>
    
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const menuOpen = ref(false);
  const windowWidth = ref(window.innerWidth);
  
  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
  };
  
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
    if (windowWidth.value >= 1100) menuOpen.value = false; // auto close menu di desktop
  };
  
  onMounted(() => {
    window.addEventListener('resize', handleResize);
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
  