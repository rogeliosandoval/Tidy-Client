import { Component, EventEmitter, Input, OnInit, Output, inject, input, signal } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'tcd-confirm',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})

export class ConfirmDialog {
  @Input() showConfirmModal = false
  @Input() message: string = ''
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()

  public closeModal() {
    this.showConfirmModal = false
    this.onClose.emit(false)
  }

  public submitModal(): void {
    this.onSubmit.emit(true)
  }
}
