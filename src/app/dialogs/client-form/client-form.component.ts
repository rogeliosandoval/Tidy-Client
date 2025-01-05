import { Component, EventEmitter, Input, OnInit, Output, inject, input, signal } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { IconFieldModule } from 'primeng/iconfield'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { SharedService } from '../../services/shared.service'
import { DropdownModule } from 'primeng/dropdown'
import { PhoneNumberDirective } from '../../directives/phone-number.directive'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'tcd-client-form',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    PhoneNumberDirective
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})

export class ClientFormDialog {
  @Input() type: string = ''
  @Input() showClientFormDialog: boolean = false
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()
  private authService = inject(AuthService)
  public sharedService = inject(SharedService)
  public dialogLoading = input<boolean>()
  public fillingForm = signal<boolean>(true)
  public showUploadAvatarButton = signal<boolean>(false)
  public avatar: File | any = null
  public avatarUrl: any
  public connections = signal<string[]>([
    'Facebook',
    'Instagram',
    'Twitter',
    'Nextdoor',
    'TikTok',
    'Craigslist Ad',
    'Referral',
    'Friend',
    'Friend of a Friend',
    'Family Friend',
    'Flyer Ad',
    'Organic SEO',
    'Business Card',
    'Cold Call',
    'Cold Email',
    'Networking Event',
    'Other'
  ])
  public clientForm = new FormGroup({
    client_name: new FormControl('', Validators.required),
    connected_by: new FormControl(''),
    client_email: new FormControl(''),
    client_phone: new FormControl(''),
    client_location: new FormControl(''),
    note: new FormControl('')
  })

  public editCheck(): void {
    if (this.type === 'edit') {
      const formData = this.sharedService.dialogClient()
      this.clientForm.get('client_name')?.setValue(formData.name)
      this.clientForm.get('connected_by')?.setValue(formData.connectedBy)
      this.clientForm.get('client_email')?.setValue(formData.email)
      this.clientForm.get('client_phone')?.setValue(formData.phone)
      this.clientForm.get('client_location')?.setValue(formData.location)
      this.clientForm.get('note')?.setValue(formData.note)
      setTimeout(() => {
        this.fillingForm.set(false)
      }, 500)
    } else {
      this.fillingForm.set(false)
    }
  }

  public avatarUpload(event: any): void {
    this.clientForm.markAsDirty()
    const file: File = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.avatarUrl = reader.result
      }
      reader.readAsDataURL(file)
      this.avatar = file
    }
  }

  public resetForm(): void {
    this.clientForm.reset()
    this.avatar = null
    this.avatarUrl = null
    this.showUploadAvatarButton.set(false)
  }

  public closeModal() {
    this.fillingForm.set(true)
    this.showClientFormDialog = false
    this.onClose.emit(false)
  }

  public submitDialog(type: string): void {
    const data = {
      avatarTouched: this.showUploadAvatarButton(),
      formData: this.clientForm.value,
      file: this.avatar,
      type
    }
    this.onSubmit.emit(data)
  }
}