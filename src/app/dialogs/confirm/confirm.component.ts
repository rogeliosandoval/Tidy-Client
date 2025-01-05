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
  @Input() showConfirmDialog = false
  @Input() message: string = ''
  @Input() type: string = ''
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()
  public dialogLoading = input<boolean>()

  public closeDialog() {
    this.showConfirmDialog = false
    this.onClose.emit(false)
  }

  public submitDialog(): void {
    this.onSubmit.emit(true)
  }
}
