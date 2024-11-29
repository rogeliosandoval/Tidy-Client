import { Component, inject } from '@angular/core'
import { RouterLink, Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'tc-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard {
  private router = inject(Router)
  public authService = inject(AuthService)

  public logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/')
      }
    })
  }
}
