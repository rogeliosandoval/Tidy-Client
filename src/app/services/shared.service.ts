import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  darkMode = signal<boolean>(false)
  loading = signal<boolean>(false)
  showAddClientModal = signal<boolean>(false)
}
