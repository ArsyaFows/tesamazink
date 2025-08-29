<!-- UserDetail.vue -->
<template>
    <AppLayout>
      <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mt-10 mr-10">
        <!-- Header dengan Background Gradient -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <h2 class="text-2xl font-extrabold">User Detail</h2>
          <p class="opacity-90">Detailed information about the selected user</p>
        </div>
  
        <!-- Body Konten -->
        <div v-if="user" class="p-8 space-y-6">
          <!-- Avatar dan Info Utama -->
          <div class="flex items-center gap-6">
            <img
              :src="user.image || 'https://dummyjson.com/icon/anonymous/128'"
              :alt="user.username"
              class="w-20 h-20 rounded-full border-4 border-gray-100 shadow-md"
            />
            <div>
              <h3 class="text-2xl font-bold text-gray-800">{{ user.firstName }} {{ user.lastName }}</h3>
              <p class="text-gray-500">{{ user.email }}</p>
              <span class="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                @{{ user.username }}
              </span>
            </div>
          </div>
  
          <!-- Informasi Detail -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
            <DetailItem label="Age" :value="user.age" icon="🎂" />
            <DetailItem label="Gender" :value="user.gender" icon="⚧️" />
            <DetailItem label="Phone" :value="user.phone" icon="📞" />
            <DetailItem label="Role" :value="user.role" icon="🔑" />
            <DetailItem label="Blood Group" :value="user.bloodGroup" icon="🩸" />
            <DetailItem label="University" :value="user.university" icon="🎓" />
            <DetailItem label="Company" :value="user.company.name" icon="🏢" />
            <DetailItem label="Position" :value="user.company.title" icon="💼" />
          </div>
  
          <!-- Alamat -->
          <div class="pt-4 border-t border-gray-200 text-left">
            <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2 justify-start">
              <span>📍</span> Address
            </h4>
            <p class="text-gray-600">
              {{ user.address.address }}, {{ user.address.city }}, {{ user.address.state }} {{ user.address.postalCode }}
            </p>
          </div>
  
          <!-- Nomor Telepon -->
          <div class="pt-3 text-left">
            <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2 justify-start">
              <span>📞</span> Phone Number
            </h4>
            <p class="text-gray-600">{{ user.phone }}</p>
          </div>
  
          <!-- Tombol Back -->
          <div class="pt-4">
            <router-link
  to="/users"
  class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-800 text-white font-medium rounded-lg transition shadow-sm"
>
  ← Back to Users
</router-link>

          </div>
        </div>
  
        <!-- Loading State -->
        <div v-else class="p-8 text-center text-gray-500">
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