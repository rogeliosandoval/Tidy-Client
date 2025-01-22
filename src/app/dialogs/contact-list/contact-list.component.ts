import { Component, EventEmitter, Input, OnInit, Output, inject, input, signal } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'tcd-contact-list',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})

export class ContactListDialog {
  @Input() showContactListDialog = false
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()
  public dialogLoading = input<boolean>()

  public closeDialog() {
    this.showContactListDialog = false
    this.onClose.emit(false)
  }

  public submitDialog(): void {
    this.onSubmit.emit(true)
  }
}