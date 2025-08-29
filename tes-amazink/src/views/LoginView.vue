<template>
  <AppLayout>
    <!-- Full screen overlay, no scroll -->
    <div
      class="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      :style="{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }"
    >
      <!-- Login Card: responsive center -->
      <div
        class="w-full max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl"
        :style="{
          backgroundColor: 'var(--header-bg)',
          border: '1px solid var(--border-color)'
        }"
      >
        <!-- Gradient Header -->
        <div
          class="p-6 text-center"
          :style="{
            background: 'linear-gradient(to right, var(--primary-bg), var(--primary-hover))'
          }"
        >
          <h2 class="text-2xl font-bold text-white">Admin Login</h2>
          <p class="mt-1 text-sm text-white">Masuk untuk mengakses dashboard</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="p-6 space-y-5">
          <!-- Username -->
          <div class="space-y-2">
            <label for="username" class="text-sm font-medium" :style="{ color: 'var(--text-color)' }">Username</label>
            <div class="relative">
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Masukkan username"
                class="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                :style="{
                  backgroundColor: 'var(--main-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }"
                required
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     :style="{ color: 'var(--secondary-text)' }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium" :style="{ color: 'var(--text-color)' }">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Masukkan password"
                class="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                :style="{
                  backgroundColor: 'var(--main-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)'
                }"
                required
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     :style="{ color: 'var(--secondary-text)' }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="p-3 rounded-lg text-sm flex items-center gap-1.5"
            :style="{
              backgroundColor: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)'
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2"
            :style="{
              background: 'linear-gradient(to right, var(--primary-bg), var(--primary-hover))',
              color: '#fff'
            }"
          >
            <template v-if="!loading">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Login
            </template>
            <template v-else>
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Memuat...
            </template>
          </button>
        </form>

        <!-- Footer -->
        <div
          class="px-6 py-4 text-center"
          :style="{ backgroundColor: 'var(--main-bg)', borderTop: '1px solid var(--border-color)' }"
        >
          <p class="text-xs" :style="{ color: 'var(--secondary-text)' }">
            Demo: Gunakan
            <code class="px-1 rounded" :style="{ backgroundColor: 'var(--border-color)' }">username</code>
            dan
            <code class="px-1 rounded" :style="{ backgroundColor: 'var(--border-color)' }">password</code>
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import AppLayout from '../views/AppLayout.vue';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const success = await useAuthStore().login({
      username: username.value,
      password: password.value,
    });

    if (success) {
      window.location.href = '/users';
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    error.value = 'Login gagal, cek username/password!';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(body), :deep(html) {
  overflow: hidden !important;
  height: 100vh;
  margin: 0;
  padding: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>