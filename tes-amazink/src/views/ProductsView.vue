<template>
    <AppLayout @logout="handleLogout">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ml-15">
        <h2 class="text-2xl font-semibold mb-6" style="color: var(--text-color);"> Products Management</h2>
  
<!-- Search & Filter -->
<div class="search-filter-container flex flex-col gap-4 mb-6">
  <!-- Search Input -->
  <div class="flex-1 min-w-60 relative">
    <input
      v-model="search"
      @input="debouncedFetch"
      placeholder="Search products..."
      class="w-full px-4 py-3 pl-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
      :style="{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--text-color)',
        borderColor: 'var(--border-color)'
      }"
    />
    <!-- Search Icon -->
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
           :style="{ color: 'var(--secondary-text)' }">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>

  <div class="flex flex-wrap gap-4 buttons-category">
<!-- Button + Category Filter -->
  <div>
    <button
      @click="openForm()"
      class="px-5 py-3 font-medium rounded-lg shadow transition"
      :style="{
        background: 'linear-gradient(to right, var(--primary-bg), var(--primary-hover) )',
        color: '#fff'
      }"
    >
      + Add Product
    </button>
</div>

<!-- Category Filter -->
<div class="relative inline-block">
    <select
      v-model="categoryFilter"
      @change="debouncedFetch"
      class="appearance-none rounded-xl px-5 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 cursor-pointer min-w-[160px] text-sm transition-all duration-200"
      :style="{
        backgroundColor: 'var(--header-bg)',
        color: 'var(--text-color)',
        borderColor: 'var(--border-color)'
      }"
    >
      <option value="">All Categories</option>
      <option value="laptops">Laptops</option>
      <option value="fragrances">Fragrances</option>
      <option value="groceries">Groceries</option>
      <option value="furniture">Furniture</option>
      <option value="beauty">Beauty</option>
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
</div>

  
<!-- Table Container -->
<div class="overflow-x-auto rounded-xl shadow-lg transition-all duration-300"
     :style="{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }">
  <table class="w-full table-auto border-collapse min-w-[800px]">
    <!-- Table Header -->
    <thead :style="{ backgroundColor: 'var(--main-bg)', color: 'var(--secondary-text)' }"
           class="uppercase text-xs font-semibold tracking-wide">
      <tr>
        <th class="px-6 py-4 text-left rounded-tl-lg">Title</th>
        <th class="px-6 py-4 text-left">Brand</th>
        <th class="px-6 py-4 text-left">Price</th>
        <th class="px-6 py-4 text-left">Category</th>
        <th class="px-6 py-4 text-left rounded-tr-lg">Action</th>
      </tr>
    </thead>

    <!-- Table Body -->
    <tbody :style="{ color: 'var(--text-color)' }" class="divide-y"
           :class="'divide-[var(--border-color)]'">
      <tr
        v-for="p in displayedProducts"
        :key="p.id"
        class="transition-all duration-200 hover:shadow-sm hover:translate-y-[-1px]"
        :style="{ backgroundColor: 'transparent' }"
        @mouseover="e => e.currentTarget.style.backgroundColor = 'var(--main-bg)'"
        @mouseleave="e => e.currentTarget.style.backgroundColor = 'transparent'"
      >
        <!-- Title -->
        <td class="px-6 py-4 font-medium max-w-xs" :style="{ color: 'var(--text-color)' }">
          <span class="truncate block" :title="p.title">
            {{ p.title }}
          </span>
        </td>

        <!-- Brand -->
        <td class="px-6 py-4" :style="{ color: 'var(--secondary-text)' }">
          {{ p.brand || '—' }}
        </td>

        <!-- Price -->
        <td class="px-6 py-4 font-semibold" :style="{ color: 'var(--text-color)' }">
          ${{ p.price.toFixed(2) }}
        </td>

        <!-- Category -->
        <td class="px-6 py-4">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium capitalize inline-block"
            :style="getCategoryColor(p.category)"
          >
            {{ p.category }}
          </span>
        </td>

        <!-- Action Buttons -->
        <td class="px-6 py-4 space-x-2 whitespace-nowrap">
          <!-- Detail Button -->
          <router-link
            :to="`/products/${p.id}`"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2"
            :style="{
              background: 'linear-gradient(to right, var(--primary-bg), var(--primary-hover))',
              color: '#fff'
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detail
          </router-link>

          <!-- Edit Button -->
          <button
            @click="editProduct(p)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2"
            :style="{
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              color: '#fff'
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
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
                class="flex-1 bg-red-400 hover:bg-red-500 text-white font-medium py-2 rounded-lg transition"
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
  const categoryFilter = ref("");
  const showForm = ref(false);
  const editData = ref(null);
  const form = ref({ title: "", brand: "", price: 0 });
  
  const fetchProducts = async () => {
    try {
      let url = `https://dummyjson.com/products?limit=100&skip=0`;
      const res = await axios.get(url);
      products.value = res.data.products;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      products.value = [];
    }
  };

  const displayedProducts = computed(() => {
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
  
    const start = (page.value - 1) * limit;
    const end = start + limit;
    return filtered.slice(start, end);
  });
  
  const debouncedFetch = debounce(() => {
    page.value = 1; 
    fetchProducts();
  }, 400);
  
  const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
  }
};

  const totalPages = computed(() => {
  return Math.max(1, Math.ceil(computedTotal.value / limit));
});


  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
    }
  };
  
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
        await axios.put(`https://dummyjson.com/products/${editData.value.id}`, form.value);
        alert("✅ Product updated successfully!");
        Object.assign(editData.value, form.value);
      } else {
        const newProduct = {
          id: Date.now(),
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
  
  const auth = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };
  const getCategoryColor = (category) => {
  const colors = {
    beauty: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    fragrances: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    furniture: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    groceries: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    laptops: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    smartphones: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'smartphones-accessories': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};
  </script>
  
  <style scoped>
  .search-filter-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  
  @media (max-width: 1000px) {
    .search-filter-container {
      flex-direction: column;
    }
    .buttons-category {
      margin-top: 0.5rem;
    }
  }
  </style>