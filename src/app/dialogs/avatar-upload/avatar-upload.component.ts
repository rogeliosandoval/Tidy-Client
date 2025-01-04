import { Component, EventEmitter, Input, Output, inject, input, signal } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { SharedService } from '../../services/shared.service'
import { AuthService } from '../../services/auth.service'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'tcd-avatar-upload',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})

export class AvatarUploadDialog {
  public sharedService = inject(SharedService)
  public authService = inject(AuthService)
  public dialogLoading = input<boolean>()
  @Input() showUploadAvatarDialog: boolean = false
  @Input() type: string = ''
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()
  public avatar: File | any = null
  public avatarUrl: any = null
  public showUploadAvatarButton = signal<boolean>(false)

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

  public closeModal() {
    this.showUploadAvatarButton.set(false)
    this.sharedService.showAvatarUploadDialog.set(false)
  }

  public submitDialog(type: string): void {
    const data = {
      type,
      file: this.avatar
    }
    this.onSubmit.emit(data)
  }
}