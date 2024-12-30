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

@Component({
  selector: 'tcd-add-client',
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
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})

export class AddClientDialog {
  @Input() showAddClientModal = false
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()
  public sharedService = inject(SharedService)
  public modalLoading = input<boolean>()
  public showUploadAvatarButton = signal<boolean>(false)
  public avatar: File | any
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
    'Family Friend',
    'Flyer Ad',
    'Organic SEO',
    'Business Card',
    'Cold Call',
    'Cold Email',
    'Networking Event',
    'Other'
  ])
  // public selectedConnection = signal<string>('')
  public clientForm = new FormGroup({
    client_name: new FormControl('', Validators.required),
    connected_by: new FormControl(''),
    client_email: new FormControl(''),
    client_phone: new FormControl(''),
    note: new FormControl('')
  })

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
  }

  public resetForm(): void {
    this.clientForm.reset()
    this.avatarUrl = null
    this.showUploadAvatarButton.set(false)
  }

  public closeModal() {
    this.showAddClientModal = false
    this.onClose.emit(false)
  }

  public submitModal(): void {
    const data = {
      formData: this.clientForm.value,
      file: this.avatar
    }
    this.onSubmit.emit(data)
  }
}