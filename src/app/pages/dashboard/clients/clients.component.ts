import { Component, OnInit, inject, signal } from '@angular/core'
import { SharedService } from '../../../services/shared.service'
import { AuthService } from '../../../services/auth.service'
import { MenuItem } from 'primeng/api'
import { MenuModule } from 'primeng/menu'
import { ConfirmDialog } from '../../../dialogs/confirm/confirm.component'
import { TruncatePipe } from '../../../pipes/truncate.pipe'
import { TooltipModule } from 'primeng/tooltip'
import { ButtonModule } from 'primeng/button'
import { Storage } from '@angular/fire/storage'
import { MessageService } from 'primeng/api'
import { UnformatPhonePipe } from '../../../pipes/unformat-phone.pipe'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'tc-clients',
  standalone: true,
  imports: [
    MenuModule,
    ConfirmDialog,
    TruncatePipe,
    TooltipModule,
    ButtonModule,
    UnformatPhonePipe,
    ProgressSpinnerModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class Clients implements OnInit {
  private messageService = inject(MessageService)
  private storage = inject(Storage)
  public sharedService = inject(SharedService)
  public authService = inject(AuthService)
  public loadingClients = signal<boolean>(true)
  public showConfirmModal = signal<boolean>(false)
  public clientOptions: MenuItem[] | undefined
  public modalMessage = signal<string>('')
  public modalType = signal<string>('')
  public modalClientName = signal<any>(null)
  public modalClientId = signal<string>('')
  public dialogLoading = signal<boolean>(false)

  ngOnInit(): void {
    setTimeout(() => {
      this.loadingClients.set(false)
    }, 700)
    this.clientOptions =  [
      {
        label: 'View Details',
        icon: 'pi pi-info-circle'
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.sharedService.clientFormType.set('edit')
          this.sharedService.showClientFormDialog.set(true)
        }
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
          this.openConfirmModal(`Are you sure you want to delete this client? (${this.modalClientName()})`, 'delete')
        }
      }
    ]
  }

  public onModalClose(newState: boolean) {
    this.showConfirmModal.set(newState)
  }

  public openConfirmModal(message: string, type: string): void {
    this.modalMessage.set(message)
    this.modalType.set(type)
    this.showConfirmModal.set(true)
  }

  public async deleteClient(): Promise<void> {
    this.dialogLoading.set(true)
    try {
      await this.authService.deleteClient(this.modalClientId())
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Client (${this.modalClientName()}) has been deleted.`,
        key: 'br',
        life: 6000,
      })
      this.dialogLoading.set(false)
      this.showConfirmModal.set(false)
    } catch (err) {
      console.log(err)
      this.dialogLoading.set(false)
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error deleting a client.',
        key: 'br',
        life: 6000,
      })
    }
  }
}
