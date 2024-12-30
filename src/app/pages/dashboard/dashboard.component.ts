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
import { StartupFormDialog } from '../../dialogs/startup-form/startup-form.component'
import { ClientFormDialog } from '../../dialogs/client-form/client-form.component'
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage'

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
    StartupFormDialog,
    ClientFormDialog
  ],
  providers: [
    MessageService
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard implements OnInit {
  private storage = inject(Storage)
  @ViewChild('addBusinessDialog') addBusinessDialog!: StartupFormDialog
  @ViewChild('addClientDialog') addClientDialog!: ClientFormDialog
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
  public dialogLoading = signal<boolean>(false)
  public showStartupFormDialog = signal<boolean>(false)

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
    // await this.authService.fetchProfileAvatar()
    // await this.authService.fetchBusinessAvatar()
    await this.authService.fetchCoreBusinessData()
    .then(() => {
      if (!this.authService.coreUserData().businessId) {
        this.showStartupFormDialog.set(true)
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
    this.showStartupFormDialog.set(newState)
    this.sharedService.showClientFormDialog.set(newState)
    this.addBusinessDialog.resetForm()
    this.addClientDialog.resetForm()
  }

  public clientFormTrigger(data: any): void {
    if (data.type === 'add') {
      this.addClient(data)
    } else {
      this.editClient()
    }
  }

  public async addClient(data: any) {
    this.dialogLoading.set(true)
    const clientId = uuidv4()
    const clientRef = doc(this.firestore, `businesses/${this.authService.coreUserData().businessId}/clients/${clientId}`)
    let avatarUrl = ''

    try {
      if (data.file) {
        const file = data.file
        const filePath = `businesses/${this.authService.coreUserData().businessId}/clients/${clientId}/avatar`
        const storageRef = ref(this.storage, filePath)
        await uploadBytesResumable(storageRef, file)
    
        // Fetch the avatar URL after uploading
        avatarUrl = await getDownloadURL(storageRef)
      }
  
      // Save the avatar URL in the client's Firestore document
      await setDoc(clientRef, {
        id: clientId,
        name: data.formData.client_name,
        email: data.formData.client_email,
        phone: data.formData.client_phone,
        connectedBy: data.formData.connected_by,
        note: data.formData.note,
        createdAt: new Date().toISOString(),
        avatarUrl: avatarUrl
      }, { merge: true })
    
      await this.authService.fetchCoreBusinessData()
  
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Client has been added!',
        key: 'br',
        life: 6000,
      })
      this.addClientDialog.resetForm()
      this.dialogLoading.set(false)
      this.sharedService.showClientFormDialog.set(false)
      this.router.navigateByUrl('/dashboard/clients')
      
    } catch (err) {
      setTimeout(() => {
        this.dialogLoading.set(false)
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error adding a client. Try again.',
          key: 'br',
          life: 6000,
        })
      }, 2000)
    }
  }

  public editClient(): void {
    console.log('EDIT CLIENT FUNCTION')
  }

  public startupFormTrigger(data: any): void {
    if (data.type === 'add') {
      this.saveBusinessName(data.businessName)
    } else {
      this.joinBusiness()
    }
  }

  public async saveBusinessName(businessName: string | null) {
    this.dialogLoading.set(true)
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
            this.showStartupFormDialog.set(false)
          })
          .then(() => {
            this.addBusinessDialog.resetForm()
            this.dialogLoading.set(false)
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Business name has been added!',
              key: 'br',
              life: 6000,
            })
          })
        }
      },
      error: (err: any) => {
        console.error(err)
        this.dialogLoading.set(false)
      },
    })
  }

  public joinBusiness(): void {
    console.log('JOIN BUSINESS FUNCTION')
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
