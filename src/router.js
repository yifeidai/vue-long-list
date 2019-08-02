import Vue from 'vue'
import Router from 'vue-router'
import Home from "./pages/home.vue"
import Dynamic from "./pages/dynamic.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/dynamic',
      component: Dynamic,
    },
  ],
})
