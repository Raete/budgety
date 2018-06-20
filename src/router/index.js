import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Login from '@/components/Login'
import Budgety from '@/components/Budgety'

Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/budgety/:id',
            name: 'Budgety',
            component: Budgety,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            name: 'Login',
            component: Login
        },
    ]
})

// router guards
router.beforeEach((to, from, next) => {
    // check to see if route has auth guard
    if(to.matched.some(rec => rec.meta.requiresAuth)){
      // check auth state of user
      let user = firebase.auth().currentUser
      if (user) {
        // User is signed in. Proceed to route
        next()
      } else {
        // No user is signed in. Redirect to login
        next({
          name: 'Login'
        })
      }
    } else {
      // if route is not guarded by auth, proceed
      next()
    }
  })
  
  export default router