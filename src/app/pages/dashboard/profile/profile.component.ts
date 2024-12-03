import { Component, inject } from '@angular/core'
import { SharedService } from '../../../services/shared.service'

@Component({
  selector: 'tc-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class Profile {
  public sharedService = inject(SharedService)
}
