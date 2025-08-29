<!-- UserManagement.vue -->

<template>
    <AppLayout @logout="handleLogout">
<!-- Wrapper container supaya cuma satu scroll -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
  <h2 class="text-2xl font-semibold mb-6" style="color: var(--text-color);"> Users Management</h2>



<!-- Search & Filter -->
<div class="flex flex-wrap gap-4 mb-6">
  <!-- Search Input -->
  <div class="flex-1 min-w-[200px] w-full relative">
    <input
      v-model="search"
      @input="debouncedFetch"
      placeholder="Search by name, email, etc."
      class="w-full px-4 py-3 pl-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
      :style="{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--text-color)',
        borderColor: 'var(--border-color)'
      }"
    />
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
           :style="{ color: 'var(--secondary-text)' }">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>

  <!-- Gender Filter -->
  <div class="min-w-[140px] w-full sm:w-auto relative">
    <select
      v-model="genderFilter"
      @change="debouncedFetch"
      class="appearance-none rounded-xl px-5 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 cursor-pointer min-w-[160px] text-sm"
      :style="{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--text-color)',
        borderColor: 'var(--border-color)'
      }"
    >
      <option value="">All Genders</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>

    <!-- Custom Dropdown Arrow -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
           :style="{ color: 'var(--secondary-text)' }">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</div>


<!-- Table Wrapper -->
<div class="overflow-x-auto rounded-xl shadow-lg transition-all duration-300"
     :style="{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }">
  <table class="min-w-full table-auto">
    <!-- Table Header -->
    <thead :style="{ backgroundColor: 'var(--main-bg)', color: 'var(--secondary-text)' }"
           class="uppercase text-xs font-semibold tracking-wide">
      <tr>
        <th class="px-5 py-4 text-left rounded-tl-lg">Username</th>
        <th class="px-5 py-4 text-left">Email</th>
        <th class="px-5 py-4 text-left">Gender</th>
        <th class="px-5 py-4 text-left w-[180px]">Phone</th>
        <th class="px-5 py-4 text-left w-[250px]">Address</th>
        <th class="px-5 py-4 text-left rounded-tr-lg">Action</th>
      </tr>
    </thead>

    <!-- Table Body -->
    <tbody :style="{ color: 'var(--text-color)' }" class="divide-y"
           :class="'divide-[var(--border-color)]'">
      <tr
        v-for="u in users"
        :key="u.id"
        class="transition-all duration-200 hover:shadow-sm hover:translate-y-[-1px]"
        :style="{ backgroundColor: 'transparent' }"
        @mouseover="e => e.currentTarget.style.backgroundColor = 'var(--main-bg)'"
        @mouseleave="e => e.currentTarget.style.backgroundColor = 'transparent'"
      >
        <!-- Username -->
        <td class="px-5 py-4 font-medium" :style="{ color: 'var(--text-color)' }">
          {{ u.username }}
        </td>

        <!-- Email -->
        <td class="px-5 py-4 max-w-xs">
          <span class="truncate block max-w-[200px]" :title="u.email" 
                :style="{ color: 'var(--secondary-text)' }">
            {{ u.email }}
          </span>
        </td>

        <!-- Gender -->
        <td class="px-5 py-4 capitalize">
          <span class="px-2.5 py-1 rounded-full text-xs font-medium inline-block"
                :style="u.gender === 'male' 
                  ? { backgroundColor: 'var(--male-bg)', color: 'var(--male-text)' }
                  : u.gender === 'female'
                    ? { backgroundColor: 'var(--female-bg)', color: 'var(--female-text)' }
                    : { backgroundColor: 'var(--other-bg)', color: 'var(--other-text)' }">
            {{ u.gender }}
          </span>
        </td>

        <!-- Phone -->
        <td class="px-5 py-4 w-[180px] font-mono" :style="{ color: 'var(--secondary-text)' }">
          {{ u.phone }}
        </td>

        <!-- Address -->
        <td class="px-5 py-4 w-[250px] max-w-xs">
          <span class="truncate block" :title="u.address.address"
                :style="{ color: 'var(--secondary-text)' }">
            {{ u.address.address }}
          </span>
        </td>

        <!-- Action Button -->
        <td class="px-5 py-4">
          <router-link
            :to="`/users/${u.id}`"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2"
            :style="{
              background: 'linear-gradient(to right, var(--primary-bg), var(--primary-hover))',
              color: '#fff'
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detail
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</div>


  </div>


<!-- Pagination -->
<div class="flex flex-wrap justify-center gap-4 mt-6 items-center">
  <button
    @click="prevPage"
    :disabled="page === 1"
    class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    ← Prev
  </button>

  <span class="text-lg font-medium text-gray-700">
    Page {{ page }} of {{ totalPages }}
  </span>

  <button
    @click="nextPage"
    :disabled="page === totalPages"
    class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Next →
  </button>
      </div>
    </AppLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { debounce } from "lodash";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../stores/auth";
  import AppLayout from "../views/AppLayout.vue";
  
  const users = ref([]);
  const page = ref(1);
  const limit = 10;
  const search = ref("");
  const genderFilter = ref("");
  const totalUsers = ref(0); // simpan total user
  const totalPages = ref(1);
  
  // Fetch users
  const fetchUsers = async () => {
  try {
    let url = `https://dummyjson.com/users?limit=${limit}&skip=${(page.value - 1) * limit}`;

    if (search.value.trim() || genderFilter.value) {
      const params = new URLSearchParams();
      if (search.value.trim()) params.append("q", search.value);
      const res = await axios.get(`https://dummyjson.com/users/search?${params}`);
      let filtered = res.data.users;

      if (genderFilter.value) {
        filtered = filtered.filter(u => u.gender === genderFilter.value);
      }

      totalUsers.value = filtered.length; // ✅ update total user
      totalPages.value = Math.ceil(totalUsers.value / limit);

      const start = (page.value - 1) * limit;
      const end = start + limit;
      users.value = filtered.slice(start, end);
    } else {
      const res = await axios.get(url);
      users.value = res.data.users;
      totalUsers.value = res.data.total; // ✅ API kasih total
      totalPages.value = Math.ceil(totalUsers.value / limit);
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    users.value = [];
    totalUsers.value = 0;
    totalPages.value = 1;
  }
};

  
  const debouncedFetch = debounce(fetchUsers, 400);
  
  const nextPage = () => {
    page.value++;
    fetchUsers();
  };
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchUsers();
    }
  };
  
  onMounted(fetchUsers);
  
  // 🔒 Logout handler
  const auth = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };

  </script>
  
  <style scoped>
  /* Tabel mengecil otomatis di bawah 1000px */
  @media (max-width: 1200px) {

  }
  </style>