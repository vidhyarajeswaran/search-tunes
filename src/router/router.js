import Vue from 'vue'
import Router from 'vue-router'
import Search from '../components/SearchTunes.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/search'
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
export default router
