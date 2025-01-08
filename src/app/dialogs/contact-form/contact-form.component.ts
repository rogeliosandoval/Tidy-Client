import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DialogModule } from 'primeng/dialog'

@Component({
  selector: 'tcd-contact-form',
  standalone: true,
  imports: [
    DialogModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})

export class ContactFormDialog {
  @Input() type: string = ''
  @Input() showContactFormDialog: boolean = false
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()

  public editCheck(): void {

  }

  public closeDialog() {
    this.showContactFormDialog = false
    this.onClose.emit(false)
  }
}