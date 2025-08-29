<template>
    <AppLayout @logout="handleLogout">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 class="text-2xl font-semibold mb-6" style="color: var(--text-color);"> Management</h2>
  
<!-- Search dan Filter -->
<div class="search-filter-container flex flex-col gap-4 mb-6">
  <!-- Search bar tetap di atas -->
  <div class="flex-1 min-w-60">
    <input
      v-model="search"
      @input="debouncedFetch"
      placeholder="🔍 Search products..."
      class="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
    />
  </div>

  <!-- Button + Category Filter -->
  <div class="flex flex-wrap gap-4 buttons-category">
    <div>
      <button
        @click="openForm()"
        class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
      >
        ➕ Add Product
      </button>
    </div>

<div class="relative inline-block">
  <select
    v-model="categoryFilter"
    @change="debouncedFetch"
    class="appearance-none bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 cursor-pointer min-w-[160px] text-sm"
    >
    <option value="">All Categories</option>
    <option value="laptops">Laptops</option>
    <option value="fragrances">Fragrances</option>
    <option value="groceries">Groceries</option>
    <option value="furniture">Furniture</option>
    <option value="beauty">Beauty</option>
  </select>

  <!-- Custom Dropdown Arrow -->
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  </div>
</div>
  </div>
</div>


  
<!-- Table Container -->
<div class="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-x-auto">
  <table class="w-full table-auto border-collapse min-w-[800px]">
    <thead class="bg-gray-50 text-gray-700 uppercase text-sm">
      <tr>
        <th class="px-6 py-4 text-left font-medium min-w-[180px]">Title</th>
        <th class="px-6 py-4 text-left font-medium min-w-[120px]">Brand</th>
        <th class="px-6 py-4 text-left font-medium min-w-[100px]">Price</th>
        <th class="px-6 py-4 text-left font-medium min-w-[120px]">Category</th>
        <th class="px-6 py-4 text-left font-medium w-32">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr
        v-for="p in displayedProducts"
        :key="p.id"
        class="hover:bg-gray-50 transition duration-150"
      >
        <td class="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" :title="p.title">
          {{ p.title }}
        </td>
        <td class="px-6 py-4 text-gray-600 truncate" :title="p.brand || '—'">
          {{ p.brand || '—' }}
        </td>
        <td class="px-6 py-4 text-gray-700 font-semibold">
          ${{ p.price.toFixed(2) }}
        </td>
        <td class="px-6 py-4 text-gray-600 capitalize">
          {{ p.category }}
        </td>
        <td class="px-6 py-4 space-x-2 whitespace-nowrap">
          <router-link
            :to="`/products/${p.id}`"
            class="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm"
          >
            Detail
          </router-link>
          <button
            @click="editProduct(p)"
            class="text-green-600 hover:text-green-800 font-medium hover:underline text-sm"
          >
            Edit
          </button>
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
    class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition 
           disabled:opacity-50 disabled:cursor-not-allowed"
  >
    ← Prev
  </button>

  <span class="text-lg font-medium text-gray-700">
    Page {{ page }} of {{ totalPages }}
  </span>

  <button
    @click="nextPage"
    :disabled="page === totalPages"
    class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition 
           disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Next →
  </button>
</div>


      </div>
  
      <!-- Modal Add/Edit Product -->
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-30"
      >
        <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
          <h3 class="text-xl font-bold text-gray-800 mb-6">
            {{ editData ? 'Edit Product' : 'Add New Product' }}
          </h3>
  
          <form @submit.prevent="saveProduct" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Enter product title"
                class="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                v-model="form.brand"
                type="text"
                placeholder="Enter brand"
                class="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                v-model.number="form.price"
                type="number"
                step="1"
                min="0"
                placeholder="Enter price"
                class="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
  
            <div class="flex gap-3 pt-2">
              <button
                type="submit"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                @click="showForm = false"
                class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  import { debounce } from "lodash";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../stores/auth";
  import AppLayout from "../views/AppLayout.vue";
  
  const products = ref([]);
  const page = ref(1);
  const limit = 9;
  const search = ref("");
  const categoryFilter = ref(""); // ✅ Tambahkan ref untuk filter
  const showForm = ref(false);
  const editData = ref(null);
  const form = ref({ title: "", brand: "", price: 0 });
  
  // Fetch Products
  const fetchProducts = async () => {
    try {
      let url = `https://dummyjson.com/products?limit=100&skip=0`; // Ambil semua produk sekali
      const res = await axios.get(url);
      products.value = res.data.products;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      products.value = [];
    }
  };
  
  // Gunakan computed untuk filter dan pagination
  const displayedProducts = computed(() => {
    let filtered = products.value;
  
    // Filter by search
    if (search.value.trim()) {
      const query = search.value.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );
    }
  
    // Filter by category
    if (categoryFilter.value) {
      filtered = filtered.filter(p => p.category === categoryFilter.value);
    }
  
    // Pagination
    const start = (page.value - 1) * limit;
    const end = start + limit;
    return filtered.slice(start, end);
  });
  
  const debouncedFetch = debounce(() => {
    page.value = 1; // Reset ke halaman 1 saat search/filter berubah
    fetchProducts();
  }, 400);
  
  const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
  }
};

  // Hitung total halaman
  const totalPages = computed(() => {
  return Math.max(1, Math.ceil(computedTotal.value / limit));
});


  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
    }
  };
  
  // Hitung total hasil setelah filter
  const computedTotal = computed(() => {
    let filtered = products.value;
  
    if (search.value.trim()) {
      const query = search.value.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );
    }
  
    if (categoryFilter.value) {
      filtered = filtered.filter(p => p.category === categoryFilter.value);
    }
  
    return filtered.length;
  });
  
  // Form Logic
  const openForm = () => {
    editData.value = null;
    form.value = { title: "", brand: "", price: 0 };
    showForm.value = true;
  };
  
  const editProduct = (p) => {
    editData.value = p;
    form.value = { title: p.title, brand: p.brand, price: p.price };
    showForm.value = true;
  };
  
  const saveProduct = async () => {
    try {
      if (editData.value) {
        // Update product (dummy API hanya simulasi)
        await axios.put(`https://dummyjson.com/products/${editData.value.id}`, form.value);
        alert("✅ Product updated successfully!");
        // Update lokal
        Object.assign(editData.value, form.value);
      } else {
        // Simulasi tambah produk (tidak nyata, karena API dummy tidak menyimpan)
        const newProduct = {
          id: Date.now(), // ID sementara
          ...form.value,
          rating: 4.5,
          stock: 50,
          discountPercentage: 10,
          category: "general",
          thumbnail: "https://via.placeholder.com/150"
        };
        products.value.unshift(newProduct);
        alert("✅ Product added (simulated)!");
      }
      showForm.value = false;
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Failed to save product.");
    }
  };
  
  onMounted(fetchProducts);
  
  // 🔒 Logout handler
  const auth = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };
  </script>
  
  <style scoped>
  /* Default: horizontal (side by side) */
  .search-filter-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  
  /* Button + Category tetap vertikal di bawah Search saat < 1000px */
  @media (max-width: 1000px) {
    .search-filter-container {
      flex-direction: column;
    }
    .buttons-category {
      margin-top: 0.5rem;
    }
  }
  </style>