import { Component, inject, signal } from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { PrimeNGConfig } from 'primeng/api'
import { SharedService } from '../../../services/shared.service'
import { PhoneNumberDirective } from '../../../directives/phone-number.directive'
import { InputTextareaModule } from 'primeng/inputtextarea'

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    PhoneNumberDirective,
    InputTextareaModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})

export class AccountSettings {
  public primengConfig = inject(PrimeNGConfig)
  public sharedService = inject(SharedService)
  public showUploadAvatarButton = signal<boolean>(false)
}
