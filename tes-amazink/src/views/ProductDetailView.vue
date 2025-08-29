<template>
  <AppLayout>
    <div class="px-6 py-8 max-w-6xl mx-auto ml-20">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="h-10 rounded-lg mb-6 w-48 " 
             :style="{ backgroundColor: 'var(--border-color)' }"></div>
        <div class="shadow-lg rounded-2xl overflow-hidden transition"
             :style="{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)' }">
          <div class="h-64" :style="{ backgroundColor: 'var(--border-color)' }"></div>
          <div class="p-6 space-y-4">
            <div class="h-6 rounded w-3/4" :style="{ backgroundColor: 'var(--border-color)' }"></div>
            <div class="h-4 rounded w-1/2" :style="{ backgroundColor: 'var(--border-color)' }"></div>
            <div class="h-4 rounded" :style="{ backgroundColor: 'var(--border-color)' }"></div>
            <div class="h-4 rounded w-5/6" :style="{ backgroundColor: 'var(--border-color)' }"></div>
          </div>
        </div>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" 
           class="shadow-xl rounded-2xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl"
           :style="{ backgroundColor: 'var(--header-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }">
        <!-- Gambar Produk -->
        <div class="relative h-64 sm:h-80 md:h-96">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full h-full object-contain"
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
            <h1 class="text-2xl sm:text-3xl font-bold" 
                :style="{ color: 'var(--text-color)' }">
              {{ product.title }}
            </h1>
            <button
              @click="$router.back()"
              class="mt-4 sm:mt-0 px-5 py-2 rounded-lg transition text-sm font-medium"
              :style="{ backgroundColor: 'var(--border-color)', color: 'var(--text-color)' }"
            >
              ← Back
            </button>
          </div>

          <p class="text-lg font-semibold mb-2"
             :style="{ color: 'var(--primary-text)' }">
            {{ product.brand }}
          </p>

          <div class="flex items-center gap-4 mb-4">
            <p class="text-3xl font-bold"
               :style="{ color: 'var(--text-color)' }">
              ${{ product.price }}
            </p>
            <p v-if="product.discountPercentage"
               class="text-sm px-2 py-1 rounded-full"
               style="background-color:#fee2e2; color:#dc2626;">
              -{{ product.discountPercentage.toFixed(1) }}%
            </p>
          </div>

          <div class="flex items-center gap-4 text-sm mb-6"
               :style="{ color: 'var(--secondary-text)' }">
            <span>⭐ {{ product.rating }} ({{ product.reviews?.length }} reviews)</span>
            <span>📦 {{ product.availabilityStatus }}</span>
          </div>

          <div class="py-4 my-6 border-t border-b"
               :style="{ borderColor: 'var(--border-color)' }">
            <p :style="{ color: 'var(--text-color)' }">
              {{ product.description }}
            </p>
          </div>

          <!-- Info Tambahan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 class="font-semibold mb-2" :style="{ color: 'var(--text-color)' }">📦 Shipping</h3>
              <p :style="{ color: 'var(--secondary-text)' }">{{ product.shippingInformation }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2" :style="{ color: 'var(--text-color)' }">🔧 Warranty</h3>
              <p :style="{ color: 'var(--secondary-text)' }">{{ product.warrantyInformation }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2" :style="{ color: 'var(--text-color)' }">🏷️ SKU</h3>
              <p class="font-mono text-xs" :style="{ color: 'var(--secondary-text)' }">{{ product.sku }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2" :style="{ color: 'var(--text-color)' }">⚖️ Weight</h3>
              <p :style="{ color: 'var(--secondary-text)' }">{{ product.weight }} kg</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="mt-6">
            <h3 class="text-sm font-semibold mb-2" :style="{ color: 'var(--text-color)' }">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="px-3 py-1 rounded-full text-xs"
                :style="{ backgroundColor: 'var(--border-color)', color: 'var(--text-color)' }"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-10">
        <p class="text-xl" style="color:red">Product not found</p>
        <button
          @click="$router.back()"
          class="mt-4 px-6 py-2 rounded-lg"
          :style="{ backgroundColor: 'var(--primary-text)', color: '#fff' }"
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