<!-- UserManagement.vue -->

<template>
    <AppLayout @logout="handleLogout">
<!-- Wrapper container supaya cuma satu scroll -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
  <h2 class="text-2xl font-semibold mb-6" style="color: var(--text-color);"> Management</h2>

  <!-- Search & Filter -->
  <div class="flex flex-wrap gap-4 mb-6 sm:flex-nowrap">
    <div class="flex-1 min-w-[200px] w-full">
      <input
        v-model="search"
        @input="debouncedFetch"
        placeholder="🔍 Search by name, email, etc."
        class="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
    </div>
    <div class="min-w-[140px] w-full sm:w-auto">
      <select
        v-model="genderFilter"
        @change="debouncedFetch"
        class="appearance-none bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 cursor-pointer min-w-[160px] text-sm"
        >
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
  </div>

  <!-- Table Wrapper: scroll horizontal cuma di sini -->
  <div class="overflow-x-auto bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200">
    <table class="min-w-full table-auto"> <!-- min-w-full biar ikut container -->
  <thead class="bg-gray-50 text-gray-700 uppercase text-sm">
    <tr>
      <th class="px-4 py-2 text-left font-medium">Username</th>
      <th class="px-4 py-2 text-left font-medium">Email</th>
      <th class="px-4 py-2 text-left font-medium">Gender</th>
      <th class="px-4 py-2 text-left font-medium w-[180px]">Phone</th>
      <th class="px-4 py-2 text-left font-medium w-[250px]">Address</th>
      <th class="px-4 py-2 text-left font-medium">Action</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200">
    <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 transition duration-150">
      <td class="px-4 py-2 font-medium text-gray-900">{{ u.username }}</td>
      <td class="px-4 py-2 text-gray-600 truncate">{{ u.email }}</td>
      <td class="px-4 py-2 text-gray-600 capitalize">{{ u.gender }}</td>
      <td class="px-4 py-2 text-gray-600 w-[180px]">{{ u.phone }}</td>
      <td class="px-4 py-2 text-gray-600 w-[250px]">{{ u.address.address }}</td>
      <td class="px-4 py-2">
        <router-link :to="`/users/${u.id}`" class="text-blue-600 hover:text-blue-800 font-medium hover:underline">Detail</router-link>
      </td>
    </tr>
  </tbody>
</table>

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