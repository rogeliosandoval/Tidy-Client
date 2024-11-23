import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedService } from '../../services/shared.service'
import { Navbar } from '../../components/navbar/navbar.component'

@Component({
  selector: 'tc-home',
  standalone: true,
  imports: [
    CommonModule,
    Navbar
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class Home {
  public sharedService = inject(SharedService)
}
