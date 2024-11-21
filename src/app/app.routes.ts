import { Routes } from '@angular/router'
import { Home } from './pages/home/home.component'
import { Signup } from './pages/signup/signup.component'
import { Login } from './pages/login/login.component'

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '**',
    component: Home
  }
]
