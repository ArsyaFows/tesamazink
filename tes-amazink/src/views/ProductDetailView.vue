<template>
  <AppLayout>
    <div class="px-6 py-8 max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 w-48"></div>
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden transition">
          <div class="h-64 bg-gray-200 dark:bg-gray-700"></div>
          <div class="p-6 space-y-4">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
        <!-- Gambar Produk -->
        <div class="relative h-64 sm:h-80 md:h-96">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-4 left-4">
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide text-white"
              :class="getCategoryColor(product.category)"
            >
              {{ product.category }}
            </span>
          </div>
        </div>

        <!-- Konten Produk -->
        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {{ product.title }}
            </h1>
            <button
              @click="$router.back()"
              class="mt-4 sm:mt-0 px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium"
            >
              ← Back
            </button>
          </div>

          <p class="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">
            {{ product.brand }}
          </p>

          <div class="flex items-center gap-4 mb-4">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              ${{ product.price }}
            </p>
            <p
              v-if="product.discountPercentage"
              class="text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded-full"
            >
              -{{ product.discountPercentage.toFixed(1) }}%
            </p>
          </div>

          <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>⭐ {{ product.rating }} ({{ product.reviews?.length }} reviews)</span>
            <span>📦 {{ product.availabilityStatus }}</span>
          </div>

          <div class="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-6">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Info Tambahan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">📦 Shipping</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ product.shippingInformation }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔧 Warranty</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ product.warrantyInformation }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">🏷️ SKU</h3>
              <p class="text-gray-600 dark:text-gray-400 font-mono text-xs">{{ product.sku }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">⚖️ Weight</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ product.weight }} kg</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="mt-6">
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-10">
        <p class="text-xl text-red-500">Product not found</p>
        <button
          @click="$router.back()"
          class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          ← Back
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import AppLayout from '../views/AppLayout.vue';

const product = ref(null);
const loading = ref(true);
const route = useRoute();

// Warna kategori
const getCategoryColor = (category) => {
  const colors = {
    beauty: 'bg-pink-500',
    fragrances: 'bg-purple-500',
    furniture: 'bg-amber-500',
    groceries: 'bg-green-500',
    laptops: 'bg-blue-500',
  };
  return colors[category] || 'bg-gray-500';
};

onMounted(async () => {
  try {
    const res = await axios.get(`https://dummyjson.com/products/${route.params.id}`);
    product.value = res.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Optional: Smooth hover effect */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>