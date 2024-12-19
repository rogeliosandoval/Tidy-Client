import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { IconFieldModule } from 'primeng/iconfield'
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'tcd-add-business',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputTextModule
  ],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.scss'
})

export class AddBusinessDialog {
  @Input() showStartupModal = false
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<string | null>()
  public modalLoading = input<boolean>()
  public startupForm = new FormGroup({
    business_name: new FormControl('', Validators.required)
  })

  public resetForm(): void {
    this.startupForm.reset()
  }

  public closeModal() {
    this.showStartupModal = false
    this.onClose.emit(false)
  }

  public submitModal(): void {
    const businessName = this.startupForm.get('business_name')?.value
    this.onSubmit.emit(businessName)
  }
}