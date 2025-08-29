import { defineStore } from 'pinia'
import api from '@/services/api'


export const useProductsStore = defineStore('products', {
state: () => ({
items: [],
total: 0,
loading: false,
page: 1,
limit: 10,
search: '',
sortBy: 'title',
order: 'asc',
category: '',
detail: null,
}),
actions: {
async fetch() {
this.loading = true
try {
const skip = (this.page - 1) * this.limit
let url = '/products'
const params = { limit: this.limit, skip, sortBy: this.sortBy, order: this.order }
if (this.search?.trim()) { url = '/products/search'; params.q = this.search.trim() }
if (this.category) { url = `/products/category/${this.category}`; delete params.sortBy; delete params.order }
const { data } = await api.get(url, { params })
this.items = data.products
this.total = data.total
} finally { this.loading = false }
},
async fetchDetail(id) {
const { data } = await api.get(`/products/${id}`)
this.detail = data
},
async add(payload) {
// per docs: POST /products/add (simulated create)
const { data } = await api.post('/products/add', payload)
return data
},
async update(id, payload) {
const { data } = await api.put(`/products/${id}`, payload)
return data
},
setPage(p) { this.page = p },
setLimit(l) { this.limit = l },
setSearch(q) { this.search = q; this.page = 1 },
setSort({ by, order }) { this.sortBy = by; this.order = order; this.page = 1 },
setCategory(c) { this.category = c; this.page = 1 },
}
})