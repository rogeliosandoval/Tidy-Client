import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SharedService } from './services/shared.service'
import { CommonModule } from '@angular/common'

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
export class AppComponent {
  public sharedService = inject(SharedService)
  
}
