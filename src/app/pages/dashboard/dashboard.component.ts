import { Component, OnInit, ViewChild, inject, signal } from '@angular/core'
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
import { PrimeNGConfig } from 'primeng/api'
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms'
import { doc, Firestore, setDoc } from '@angular/fire/firestore'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { take } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { AddBusinessDialog } from '../../dialogs/add-business/add-business.component'
import { AddClientDialog } from '../../dialogs/add-client/add.client.component'

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
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AddBusinessDialog,
    AddClientDialog
  ],
  providers: [
    MessageService
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard implements OnInit {
  @ViewChild('addBusinessDialog') addBusinessDialog!: AddBusinessDialog
  private messageService = inject(MessageService)
  private firestore = inject(Firestore)
  private router = inject(Router)
  private uid = signal<any>('')
  public primengConfig = inject(PrimeNGConfig)
  public authService = inject(AuthService)
  public sharedService = inject(SharedService)
  public items: MenuItem[] | undefined
  public currentRoute = signal<string>('')
  public sidebarVisible = signal<boolean>(false)
  public modalLoading = signal<boolean>(false)
  public showStartupModal = signal<boolean>(false)
  public showAddClientModal = signal<boolean>(false)

  ngOnInit(): void {
    this.primengConfig.ripple = true
    this.initializeApp()

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
        icon: 'pi pi-inbox',
        command: () => {
          this.router.navigateByUrl('/dashboard/inbox')
        }
      },
      {
        label: 'Account Settings',
        icon: 'pi pi-cog',
        command: () => {
          this.router.navigateByUrl('/dashboard/account-settings')
        }
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

  public async initializeApp(): Promise<void> {
    this.sharedService.loading.set(true)
    await this.authService.fetchCoreUserData()
    await this.authService.fetchProfileAvatar()
    await this.authService.fetchBusinessAvatar()
    await this.authService.fetchCoreBusinessData()
    .then(() => {
      if (!this.authService.coreUserData().business_id) {
        this.showStartupModal.set(true)
      }
    })
    .then(() => {
      this.sharedService.loading.set(false)
    })
  }

  public grabRoute() {
    return this.router.url
  }

  public onModalClose(newState: boolean) {
    this.showStartupModal.set(newState)
    this.showAddClientModal.set(newState)
    this.addBusinessDialog.resetForm()
  }

  public async addClient(data: any) {
    this.modalLoading.set(true)
    const clientId = uuidv4() 
    const clientRef = doc(this.firestore, `businesses/${this.authService.coreBusinessData().id}/clients/${clientId}`)

    await setDoc(clientRef, {
      id: clientId,
      name: data.formData.client_name,
      createdAt: new Date().toISOString()
    }, { merge: true })
    .then(() => {
      this.modalLoading.set(false)
      this.showAddClientModal.set(false)
    })
  }

  public async saveBusinessName(businessName: string | null) {
    this.modalLoading.set(true)
    this.authService.user$
    .pipe(take(1))
    .subscribe({
      next: async (data: any) => {
        if (data && data.uid) {
          const uid = data.uid
          const businessId = uuidv4()
          const userRef = doc(this.firestore, `users/${uid}`)
          const businessRef = doc(this.firestore, `businesses/${businessId}`)

          await setDoc(businessRef, {
            id: businessId,
            name: businessName,
            clients: 0,
            members: 1, // Initial member count
            owner: uid, // Reference the owner
          })

          await setDoc(userRef, { businessId: businessId }, { merge: true })

          await this.authService.fetchCoreUserData()

          await this.authService.fetchCoreBusinessData()
          .then(() => {
            this.showStartupModal.set(false)
          })
          .then(() => {
            this.addBusinessDialog.resetForm()
            this.modalLoading.set(false)
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Business name has been added!',
              key: 'br',
              life: 4000,
            })
          })
        }
      },
      error: (err: any) => {
        console.error(err)
        this.modalLoading.set(false)
      },
    })
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
