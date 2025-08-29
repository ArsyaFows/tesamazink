<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div>
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="error" style="color:red">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue"
  import { useAuthStore } from "../stores/auth"
  
  const username = ref("")
  const password = ref("")
  const error = ref("")
  const auth = useAuthStore()
  
  const handleLogin = async () => {
    error.value = ""
    try {
      const success = await auth.login({ 
        username: username.value, 
        password: password.value 
      })
  
      if (success) {
        // 🔥 langsung redirect + refresh
        window.location.href = "/users"
      }
    } catch (err) {
      console.error("❌ Login error:", err)
      error.value = "Login gagal, cek username/password!"
    }
  }
  </script>
  