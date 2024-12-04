import { Component, OnInit, inject } from '@angular/core'
import { SharedService } from '../../../services/shared.service'
import { MenuItem } from 'primeng/api'
import { MenuModule } from 'primeng/menu'

@Component({
  selector: 'tc-clients',
  standalone: true,
  imports: [
    MenuModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class Clients implements OnInit {
  public sharedService = inject(SharedService)
  public clientOptions: MenuItem[] | undefined

  ngOnInit(): void {
    this.clientOptions = [
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
        icon: 'pi pi-trash'
      }
    ]
  }
}
