<template>
    <div v-if="product">
      <h2>Product Detail</h2>
      <p><b>Title:</b> {{ product.title }}</p>
      <p><b>Brand:</b> {{ product.brand }}</p>
      <p><b>Price:</b> ${{ product.price }}</p>
      <p><b>Description:</b> {{ product.description }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue"
  import { useRoute } from "vue-router"
  import axios from "axios"
  
  const product = ref(null)
  const route = useRoute()
  
  onMounted(async () => {
    const res = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = res.data
  })
  </script>
  