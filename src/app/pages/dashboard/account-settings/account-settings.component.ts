import { Component, OnInit, inject, signal } from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { PrimeNGConfig } from 'primeng/api'
import { SharedService } from '../../../services/shared.service'
import { PhoneNumberDirective } from '../../../directives/phone-number.directive'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { AuthService } from '../../../services/auth.service'
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage'
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { take } from 'rxjs'
import { doc, Firestore, setDoc } from '@angular/fire/firestore'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    PhoneNumberDirective,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})

export class AccountSettings implements OnInit {
  private messageService = inject(MessageService)
  private firestore = inject(Firestore)
  private storage = inject(Storage)
  public primengConfig = inject(PrimeNGConfig)
  public sharedService = inject(SharedService)
  public authService = inject(AuthService)
  public savingChanges = signal<boolean>(false)
  public avatar: File | any
  public avatarUrl: any
  public showUploadAvatarButton = signal<boolean>(false)
  public businessAvatar: File | any
  public businessAvatarUrl: any
  public showUploadBusinessAvatarButton = signal<boolean>(false)
  public defaultProfileForm: any
  public profileForm = new FormGroup({
    name: new FormControl(this.authService.coreUserData().name),
    email: new FormControl({ value: this.authService.coreUserData().email, disabled: true}),
    position: new FormControl(this.authService.coreUserData().position),
    phone: new FormControl(this.authService.coreUserData().phone),
    location: new FormControl(this.authService.coreUserData().location),
    message: new FormControl(this.authService.coreUserData().message)
  })
  public defaultBusinessForm: any
  public businessForm = new FormGroup({
    name: new FormControl(this.authService.coreBusinessData().name)
  })

  ngOnInit(): void {
    this.defaultProfileForm = this.profileForm.value
    this.defaultBusinessForm = this.businessForm.value
  }

  public avatarUpload(event: any): void {
    const file: File = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.avatarUrl = reader.result
      }
      reader.readAsDataURL(file)
      this.avatar = file
    }
    this.profileForm.markAsDirty()
  }

  public businessAvatarUpload(event: any): void {
    const file: File = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.businessAvatarUrl = reader.result
      }
      reader.readAsDataURL(file)
      this.businessAvatar = file
    }
    this.businessForm.markAsDirty()
  }

  public cancelProfileChanges(): void {
    this.profileForm.get('name')?.setValue(this.defaultProfileForm?.name)
    this.profileForm.get('position')?.setValue(this.defaultProfileForm?.position)
    this.profileForm.get('phone')?.setValue(this.defaultProfileForm?.phone)
    this.profileForm.get('location')?.setValue(this.defaultProfileForm?.location)
    this.profileForm.get('message')?.setValue(this.defaultProfileForm?.message)
    this.avatarUrl = null
    this.showUploadAvatarButton.set(false)
    this.profileForm.markAsPristine()
  }

  public cancelBusinessChanges(): void {
    this.businessForm.get('name')?.setValue(this.defaultBusinessForm?.name)
    this.businessAvatarUrl = null
    this.showUploadBusinessAvatarButton.set(false)
    this.businessForm.markAsPristine()
  }

  public saveProfileChanges(): void {
    this.savingChanges.set(true)
    const formData = this.profileForm.value
    let avatarUrl = ''

    setTimeout(() => {
      this.authService.user$
      .pipe(take(1))
      .subscribe({
        next: async (data: any) => {
          if (data && data.uid) {
            const uid = data.uid
            const userRef = doc(this.firestore, `users/${uid}`)

            if (this.avatarUrl) {
              const file = this.avatar
              const filePath = `users/${uid}/avatar`
              const storageRef = ref(this.storage, filePath)
              await uploadBytesResumable(storageRef, file)
              avatarUrl = await getDownloadURL(storageRef)
            } else {
              await this.authService.deleteProfileAvatar()
              avatarUrl = ''
            }

            await setDoc(userRef, {
              name: formData.name,
              position: formData.position,
              phone: formData.phone,
              location: formData.location,
              message: formData.message,
              avatarUrl: avatarUrl
            }, { merge: true })

            await this.authService.fetchCoreUserData()
            .then(() => {
              if (!avatarUrl) {
                this.showUploadAvatarButton.set(false)
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile has been updated!',
                key: 'br',
                life: 6000,
              })
            })
            .then(() => {
              this.profileForm.markAsPristine()
              this.savingChanges.set(false)
            })
          }
        },
        error: (err: any) => {
          console.log(err)
          this.savingChanges.set(false)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error updating your profile. Try again',
            key: 'br',
            life: 6000,
          })
        }
      })
    }, 1000)
  }

  public saveBusinessChanges(): void {
    this.savingChanges.set(true)
    const formData = this.businessForm.value
    let avatarUrl = ''

    setTimeout(() => {
      this.authService.user$
      .pipe(take(1))
      .subscribe({
        next: async (data: any) => {
          if (data && data.uid) {
            const businessRef = doc(this.firestore, `businesses/${this.authService.coreUserData().businessId}`)

            if (this.businessAvatarUrl) {
              const file = this.businessAvatar
              const filePath = `businesses/${this.authService.coreUserData().businessId}/avatar`
              const storageRef = ref(this.storage, filePath)
              await uploadBytesResumable(storageRef, file)
              avatarUrl = await getDownloadURL(storageRef)
            } else {
              await this.authService.deleteBusinessAvatar()
              avatarUrl = ''
            }

            await setDoc(businessRef, {
              name: formData.name,
              avatarUrl: avatarUrl
            }, { merge: true })

            await this.authService.fetchCoreBusinessData()
            .then(() => {
              if (!avatarUrl) {
                this.showUploadBusinessAvatarButton.set(false)
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Business profile has been updated!',
                key: 'br',
                life: 6000,
              })
            })
            .then(() => {
              this.businessForm.markAsPristine()
              this.savingChanges.set(false)
            })
          }
        },
        error: (err: any) => {
          console.log(err)
          this.savingChanges.set(false)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error updating your profile. Try again.',
            key: 'br',
            life: 6000,
          })
        }
      })
    }, 1000)
  }
}
