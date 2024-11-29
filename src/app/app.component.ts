import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SharedService } from './services/shared.service'
import { CommonModule } from '@angular/common'
import { AuthService } from './services/auth.service'
import { UserInterface } from './interfaces/user.interface'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService)
  public sharedService = inject(SharedService)
  
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.authService.currentUserSignal.set({
          email: user.email!,
          name: user.displayName!,
        })
      } else {
        this.authService.currentUserSignal.set(null)
      }
    })

    setTimeout(() => {
      console.log(this.authService.currentUserSignal())
    }, 1000)
  }
}
