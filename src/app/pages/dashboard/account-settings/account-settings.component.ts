import { Component, OnInit, ViewChild, inject, signal } from '@angular/core'
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
import { DialogModule } from 'primeng/dialog'
import { AvatarUploadDialog } from '../../../dialogs/avatar-upload/avatar-upload.component'

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
    ProgressSpinnerModule,
    DialogModule,
    AvatarUploadDialog
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})

export class AccountSettings implements OnInit {
  @ViewChild('avatarUploadDialog') avatarUploadDialog!: AvatarUploadDialog
  private messageService = inject(MessageService)
  private firestore = inject(Firestore)
  private storage = inject(Storage)
  public primengConfig = inject(PrimeNGConfig)
  public sharedService = inject(SharedService)
  public authService = inject(AuthService)
  public savingChanges = signal<boolean>(false)
  public dialogLoading = signal<boolean>(false)
  public uploadAvatarType = signal<string>('')
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

  public triggerAvatarUpload(type: string): void {
    if (type === 'profile') {
      this.uploadAvatarType.set('profile')
      this.sharedService.showAvatarUploadDialog.set(true)
    } else {
      this.uploadAvatarType.set('business')
      this.sharedService.showAvatarUploadDialog.set(true)
    }
  }

  public async saveAvatar(data: any): Promise<void> {
    this.dialogLoading.set(true)
    let avatarUrl = ''

    if (data.file && data.type === 'profile') {
      const userRef = doc(this.firestore, `users/${this.authService.coreUserData().uid}`)
      const file = data.file
      const filePath = `users/${this.authService.coreUserData().uid}/avatar`
      const storageRef = ref(this.storage, filePath)
      await uploadBytesResumable(storageRef, file)
      avatarUrl = await getDownloadURL(storageRef)
  
      await setDoc(userRef, {
        avatarUrl: avatarUrl
      }, { merge: true })

      await this.authService.fetchCoreUserData()

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Avatar has been saved!',
        key: 'br',
        life: 6000,
      })

      this.sharedService.showAvatarUploadDialog.set(false)
    } else if (!data.file && data.type === 'profile') {
      const userRef = doc(this.firestore, `users/${this.authService.coreUserData().uid}`)

      await this.authService.deleteProfileAvatar()

      await setDoc(userRef, {
        avatarUrl: avatarUrl
      }, { merge: true })

      await this.authService.fetchCoreUserData()

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Avatar has been deleted!',
        key: 'br',
        life: 6000,
      })

      this.sharedService.showAvatarUploadDialog.set(false)
    }

    if (data.file && data.type !== 'profile') {
      const businessRef = doc(this.firestore, `businesses/${this.authService.coreUserData().businessId}`)
      const file = data.file
      const filePath = `businesses/${this.authService.coreUserData().businessId}/avatar`
      const storageRef = ref(this.storage, filePath)
      await uploadBytesResumable(storageRef, file)
      avatarUrl = await getDownloadURL(storageRef)

      await setDoc(businessRef, {
        avatarUrl: avatarUrl
      }, { merge: true })

      await this.authService.fetchCoreBusinessData()

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Logo has been saved!',
        key: 'br',
        life: 6000,
      })

      this.sharedService.showAvatarUploadDialog.set(false)
    } else if (!data.file && data.type !== 'profile') {
      const businessRef = doc(this.firestore, `businesses/${this.authService.coreUserData().businessId}`)

      await this.authService.deleteBusinessAvatar()

      await setDoc(businessRef, {
        avatarUrl: avatarUrl
      }, { merge: true })

      await this.authService.fetchCoreBusinessData()

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Logo has been removed.',
        key: 'br',
        life: 6000,
      })

      this.sharedService.showAvatarUploadDialog.set(false)
    }

    setTimeout(() => {
      this.avatarUploadDialog.avatar = null
      this.avatarUploadDialog.avatarUrl = null
      this.avatarUploadDialog.showUploadAvatarButton.set(false)
      this.dialogLoading.set(false)
    }, 1000)
  }

  public cancelProfileChanges(): void {
    this.profileForm.get('name')?.setValue(this.defaultProfileForm?.name)
    this.profileForm.get('position')?.setValue(this.defaultProfileForm?.position)
    this.profileForm.get('phone')?.setValue(this.defaultProfileForm?.phone)
    this.profileForm.get('location')?.setValue(this.defaultProfileForm?.location)
    this.profileForm.get('message')?.setValue(this.defaultProfileForm?.message)
    this.profileForm.markAsPristine()
  }

  public cancelBusinessChanges(): void {
    this.businessForm.get('name')?.setValue(this.defaultBusinessForm?.name)
    this.businessForm.markAsPristine()
  }

  public saveProfileChanges(): void {
    this.savingChanges.set(true)
    const formData = this.profileForm.value

    setTimeout(() => {
      this.authService.user$
      .pipe(take(1))
      .subscribe({
        next: async (data: any) => {
          if (data && data.uid) {
            const uid = data.uid
            const userRef = doc(this.firestore, `users/${uid}`)

            await setDoc(userRef, {
              name: formData.name,
              position: formData.position,
              phone: formData.phone,
              location: formData.location,
              message: formData.message
            }, { merge: true })

            this.defaultProfileForm = formData

            await this.authService.fetchCoreUserData()
            .then(() => {
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

    setTimeout(() => {
      this.authService.user$
      .pipe(take(1))
      .subscribe({
        next: async (data: any) => {
          if (data && data.uid) {
            const businessRef = doc(this.firestore, `businesses/${this.authService.coreUserData().businessId}`)

            await setDoc(businessRef, {
              name: formData.name
            }, { merge: true })

            this.defaultBusinessForm = formData

            await this.authService.fetchCoreBusinessData()
            .then(() => {
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
