import { Component, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from '../../../../services/auth.service'
import { SharedService } from '../../../../services/shared.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'tc-client-details',
  standalone: true,
  imports: [
    ProgressSpinnerModule
  ],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})

export class ClientDetails implements OnInit {
  private activatedRoute = inject(ActivatedRoute)
  public authService = inject(AuthService)
  public sharedService = inject(SharedService)
  public loadingClient = signal<boolean>(true)

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe({
      next: async (data) => {
        await this.authService.fetchClientDataById(data.get('id'))
        this.sharedService.dialogClient.set(this.authService.dialogClient())
        this.loadingClient.set(false)
      },
      error: err => {
        console.log(err)
        this.loadingClient.set(false)
      }
    })
  }
}