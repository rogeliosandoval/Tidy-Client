import { Component, inject } from '@angular/core'
import { SharedService } from '../../../services/shared.service'

@Component({
  selector: 'tc-overview',
  standalone: true,
  imports: [

  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})

export class Overview {
  public sharedService = inject(SharedService)
}
