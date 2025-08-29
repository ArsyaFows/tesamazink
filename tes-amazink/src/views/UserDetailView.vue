<!-- UserDetail.vue -->
<template>
    <AppLayout>
      <div 
  class="max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden border mt-10 ml-15 transition"
  :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }"
>
  <!-- Header -->
  <div 
    class="p-6 text-white"
    :style="{ background: `linear-gradient(to right, var(--primary-text), purple)` }"
  >
    <h2 class="text-2xl font-extrabold">User Detail</h2>
    <p class="opacity-90">Detailed information about the selected user</p>
  </div>

  <!-- Body -->
  <div v-if="user" class="p-8 space-y-6">
    <!-- Avatar -->
    <div class="flex items-center gap-6">
      <img
        :src="user.image || 'https://dummyjson.com/icon/anonymous/128'"
        :alt="user.username"
        class="w-20 h-20 rounded-full border-4 shadow-md"
        :style="{ borderColor: 'var(--border-color)' }"
      />
      <div>
        <h3 class="text-2xl font-bold" :style="{ color: 'var(--text-color)' }">
          {{ user.firstName }} {{ user.lastName }}
        </h3>
        <p :style="{ color: 'var(--secondary-text)' }">{{ user.email }}</p>
        <span
          class="inline-block mt-1 px-3 py-1 text-sm rounded-full font-medium"
          :style="{ backgroundColor: 'var(--tag-bg)', color: 'var(--primary-text)' }"
        >
          @{{ user.username }}
        </span>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5" :style="{ color: 'var(--text-color)' }">
      <DetailItem label="Age" :value="user.age" icon="🎂" />
      <DetailItem label="Gender" :value="user.gender" icon="⚧️" />
      <DetailItem label="Phone" :value="user.phone" icon="📞" />
      <DetailItem label="Role" :value="user.role" icon="🔑" />
      <DetailItem label="Blood Group" :value="user.bloodGroup" icon="🩸" />
      <DetailItem label="University" :value="user.university" icon="🎓" />
      <DetailItem label="Company" :value="user.company.name" icon="🏢" />
      <DetailItem label="Position" :value="user.company.title" icon="💼" />
    </div>

    <!-- Address -->
    <div class="pt-4 border-t" :style="{ borderColor: 'var(--border-color)' }">
      <h4 class="font-semibold mb-2 flex items-center gap-2" :style="{ color: 'var(--text-color)' }">
        📍 Address
      </h4>
      <p :style="{ color: 'var(--secondary-text)' }">
        {{ user.address.address }}, {{ user.address.city }}, {{ user.address.state }} {{ user.address.postalCode }}
      </p>
    </div>

    <!-- Phone -->
    <div class="pt-3">
      <h4 class="font-semibold mb-2 flex items-center gap-2" :style="{ color: 'var(--text-color)' }">
        📞 Phone Number
      </h4>
      <p :style="{ color: 'var(--secondary-text)' }">{{ user.phone }}</p>
    </div>

    <!-- Back Button -->
    <div class="pt-4">
      <router-link
        to="/users"
        class="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition shadow-sm"
        :style="{ backgroundColor: 'var(--primary-text)', color: '#fff' }"
      >
        ← Back to Users
      </router-link>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="p-8 text-center" :style="{ color: 'var(--secondary-text)' }">
    Loading user data...
  </div>
</div>

    </AppLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import axios from "axios";
  import AppLayout from "./AppLayout.vue";
  
  // Komponen DetailItem Inline
  const DetailItem = {
    props: ["label", "value", "icon"],
    template: `
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ icon }}</span>
        <strong class="text-gray-900">{{ label }}:</strong>
        <span class="text-gray-700">{{ value || '—' }}</span>
      </div>
    `,
  };
  
  const user = ref(null);
  const route = useRoute();
  
  onMounted(async () => {
    try {
      // ✅ Perbaiki: Hilangkan spasi ekstra di URL
      const res = await axios.get(`https://dummyjson.com/users/${route.params.id}`);
      user.value = res.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      user.value = null;
    }
  });
  </script>
  
  <style scoped>
  /* Optional: animasi halus */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>