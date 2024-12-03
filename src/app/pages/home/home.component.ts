import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedService } from '../../services/shared.service'
import { Navbar } from '../../components/navbar/navbar.component'
import { RouterLink } from '@angular/router'
import { Footer } from '../../components/footer/footer.component'

@Component({
  selector: 'tc-home',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Footer,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class Home {
  public sharedService = inject(SharedService)
}
