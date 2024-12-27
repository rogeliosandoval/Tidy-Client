import { Component, OnInit, inject, signal } from '@angular/core'
import { SharedService } from '../../../services/shared.service'
import { AuthService } from '../../../services/auth.service'
import { MenuItem } from 'primeng/api'
import { MenuModule } from 'primeng/menu'
import { ConfirmDialog } from '../../../dialogs/confirm/confirm.component'
import { TruncatePipe } from '../../../pipes/truncate.pipe'
import { TooltipModule } from 'primeng/tooltip'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'tc-clients',
  standalone: true,
  imports: [
    MenuModule,
    ConfirmDialog,
    TruncatePipe,
    TooltipModule,
    ButtonModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class Clients implements OnInit {
  public sharedService = inject(SharedService)
  public authService = inject(AuthService)
  public showConfirmModal = signal<boolean>(false)
  public clientOptions: MenuItem[] | undefined
  public modalMessage = signal<string>('')
  public modalClientName = signal<any>(null)

  ngOnInit(): void {
    this.clientOptions =  [
      {
        label: 'View Details',
        icon: 'pi pi-info-circle'
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Create Note',
        icon: 'pi pi-pen-to-square'
      },
      {
        label: 'Send Email',
        icon: 'pi pi-envelope'
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.openConfirmModal(`Are you sure you want to delete this client? (${this.modalClientName()})`)
        }
      }
    ]
  }

  public onModalClose(newState: boolean) {
    this.showConfirmModal.set(newState)
  }

  public openConfirmModal(message: string): void {
    this.modalMessage.set(message)
    this.showConfirmModal.set(true)
  }
}
