import { Component, OnInit, inject, signal } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { SharedService } from '../../services/shared.service'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { SidebarModule } from 'primeng/sidebar'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'tc-dashboard',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MenuModule,
    ProgressSpinnerModule,
    RouterOutlet,
    SidebarModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard implements OnInit {
  private router = inject(Router)
  public authService = inject(AuthService)
  public sharedService = inject(SharedService)
  public items: MenuItem[] | undefined
  public currentRoute = signal<string>('')
  public sidebarVisible = signal<boolean>(false)
  public showStartupModal: boolean = false
  public fetchingData = signal<boolean>(true)
  public userData = signal<any>(undefined)
  public startupForm = new FormGroup({
    
  })

  ngOnInit(): void {
    this.authService.fetchCoreUserData()
    .then((data: any) => {
      this.userData.set(data)
    })
    .then(() => {
      this.fetchingData.set(false)
    })

    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigateByUrl('/dashboard/profile')
        }
      },
      {
        label: 'Inbox',
        icon: 'pi pi-inbox'
      },
      {
        label: 'Account Settings',
        icon: 'pi pi-cog'
      },
      {
        label: 'Sign Off',
        icon: 'pi pi-sign-out',
        command: () => {
          this.signOff()
        }
      }
    ]
  }

  public grabRoute() {
    return this.router.url
  }

  public signOff(): void {
    this.sharedService.loading.set(true)

    setTimeout(() => {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigateByUrl('/login')
          this.sharedService.loading.set(false)
        }
      })
    }, 2000)
  }
}
