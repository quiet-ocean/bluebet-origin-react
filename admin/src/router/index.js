import Vue from 'vue'
import VueRouter from 'vue-router'
import Restricted from '../views/restricted'
import Login from '../views/login'
import Logout from '../views/logout'
import Layout from '../views/layout'
import Dashboard from '../views/dashboard'
import Users from '../views/users'
import User from '../views/user'
import Transactions from '../views/transactions'
import ManualWithdrawals from '../views/manualWithdrawals'
import Vips from '../views/vips'
import Race from '../views/race'
import Trivia from '../views/trivia'
import Coupons from '../views/coupons'

import Auth from '../lib/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/restricted',
    name: 'restricted',
    component: Restricted,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    component: Layout,
    async beforeEnter(to, from, next) {
      let access = await Auth.checkAccess(Vue.ls.get('token'))

      if (!access) next('/restricted')
      else next()
    },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { name: 'dashboard' },
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { name: 'users' },
      },
      {
        path: 'user/:userId',
        name: 'User',
        component: User,
        meta: {
          name: 'user',
        },
      },
      {
        path: 'manualWithdrawals',
        name: 'ManualWithdrawals',
        component: ManualWithdrawals,
        meta: {
          name: 'manualWithdrawals',
        },
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: Transactions,
        meta: { name: 'transactions' },
      },
      {
        path: 'vips',
        name: 'Vips',
        component: Vips,
        meta: { name: 'vips' },
      },
      {
        path: 'race',
        name: 'Race',
        meta: { name: 'race' },
        component: Race,
      },
      {
        path: 'trivia',
        name: 'Trivia',
        meta: { name: 'trivia' },
        component: Trivia,
      },
      {
        path: 'coupons',
        name: 'Coupons',
        meta: { name: 'coupons' },
        component: Coupons,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
