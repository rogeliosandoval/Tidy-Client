import { Component, EventEmitter, inject, input, Input, Output, signal } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { SharedService } from '../../services/shared.service'
import { ButtonModule } from 'primeng/button'
import { PhoneNumberDirective } from '../../directives/phone-number.directive'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'tcd-contact-form',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PhoneNumberDirective,
    ProgressSpinnerModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})

export class ContactFormDialog {
  @Input() type: string = ''
  @Input() showContactFormDialog: boolean = false
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onSubmit = new EventEmitter<any>()
  public dialogLoading = input<boolean>()
  public sharedService = inject(SharedService)
  public fillingForm = signal<boolean>(true)
  public contactForm = new FormGroup({
    contact_name: new FormControl('', Validators.required),
    contact_email: new FormControl(''),
    contact_position: new FormControl(''),
    contact_phone: new FormControl('')
  })

  public resetForm(): void {
    this.contactForm.reset()
  }

  public editCheck(): void {

  }

  public closeDialog() {
    this.showContactFormDialog = false
    this.onClose.emit(false)
  }

  public submitDialog(type: string): void {
    const data = {
      formData: this.contactForm.value,
      type
    }
    this.onSubmit.emit(data)
  }
}