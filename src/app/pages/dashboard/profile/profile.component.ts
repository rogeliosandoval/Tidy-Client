import { Component, inject } from '@angular/core'
import { SharedService } from '../../../services/shared.service'
import { AuthService } from '../../../services/auth.service'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tc-profile',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class Profile {
  public sharedService = inject(SharedService)
  public authService = inject(AuthService)
}
