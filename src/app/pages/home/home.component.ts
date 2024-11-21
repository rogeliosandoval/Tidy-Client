import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedService } from '../../services/shared.service'

@Component({
  selector: 'tc-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class Home {
  public sharedService = inject(SharedService)
}
