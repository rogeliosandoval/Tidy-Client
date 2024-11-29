import { Routes } from '@angular/router'
import { Home } from './pages/home/home.component'
import { Signup } from './pages/signup/signup.component'
import { Login } from './pages/login/login.component'
import { Dashboard } from './pages/dashboard/dashboard.component'

export const routes: Routes = [
  {
    path: '',
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
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: '**',
    redirectTo: ''
  }
]
