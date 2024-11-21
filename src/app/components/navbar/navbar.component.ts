import { Component, signal } from '@angular/core';

@Component({
  selector: 'tc-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class Navbar {
  public lightMode = signal<boolean>(true)
}
