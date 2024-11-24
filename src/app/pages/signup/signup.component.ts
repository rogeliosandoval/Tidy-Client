import { Component, OnInit, inject } from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { PrimeNGConfig } from 'primeng/api'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tc-signup',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class Signup implements OnInit {
  public primengConfig = inject(PrimeNGConfig)

  ngOnInit(): void {
    this.primengConfig.ripple = true
  }
}
