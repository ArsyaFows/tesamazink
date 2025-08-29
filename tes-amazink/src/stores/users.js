import { defineStore } from 'pinia'
import api from '../services/api'


export const useUsersStore = defineStore('users', {
state: () => ({
items: [],
total: 0,
loading: false,
// query state
page: 1,
limit: 10,
search: '',
sortBy: 'firstName',
order: 'asc',
// filter example (users docs support /users/filter?key=hair.color&value=Brown)
filterKey: '',
filterValue: '',
}),
actions: {
async fetch() {
this.loading = true
try {
const skip = (this.page - 1) * this.limit


// choose endpoint based on search / filter
let url = '/users'
const params = { limit: this.limit, skip, sortBy: this.sortBy, order: this.order }


if (this.search?.trim()) {
url = '/users/search'
params.q = this.search.trim()
} else if (this.filterKey && this.filterValue) {
url = '/users/filter'
params.key = this.filterKey
params.value = this.filterValue
}


const { data } = await api.get(url, { params })
this.items = data.users
this.total = data.total
} finally {
this.loading = false
}
},
setPage(p) { this.page = p },
setLimit(l) { this.limit = l },
setSearch(q) { this.search = q; this.page = 1 },
setSort({ by, order }) { this.sortBy = by; this.order = order; this.page = 1 },
setFilter({ key, value }) { this.filterKey = key; this.filterValue = value; this.page = 1 },
},
})