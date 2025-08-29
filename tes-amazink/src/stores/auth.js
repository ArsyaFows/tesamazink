// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '../services/api'
import { ref, nextTick } from "vue"


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    async login({ username, password }) {
        this.loading = true
        try {
          const { data } = await api.post('/auth/login', { username, password })
      
          this.token = data.token
          this.user = data
          localStorage.setItem('token', this.token)
          localStorage.setItem('auth_user', JSON.stringify(this.user))
      
          // langsung return true sebagai tanda sukses
          return true
        } finally {
          this.loading = false
        }
      },
      

    async fetchMe() {
      if (!this.token) return
      // ❌ DummyJSON ga ada /auth/me → kalau mau fetch user lagi, bisa /auth/me (tapi fake)
      // pakai /users/{id} kalau butuh detail user
      const { data } = await api.get(`/users/${this.user.id}`)
      this.user = data
      localStorage.setItem('auth_user', JSON.stringify(this.user))
    },

    async register(payload) {
      this.loading = true
      try {
        // ✅ DummyJSON register simulation: https://dummyjson.com/users/add
        const { data } = await api.post('/users/add', payload)

        // Simulasi auto-login setelah register
        this.user = data
        this.token = 'dummy-token' // karena /users/add ga ngasih token beneran

        localStorage.setItem('token', this.token)
        localStorage.setItem('auth_user', JSON.stringify(this.user))

        return data
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('auth_user')
    },
  },
})
