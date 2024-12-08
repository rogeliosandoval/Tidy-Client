import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[phoneNumber]',
  standalone: true
})

export class PhoneNumberDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement
    let cleaned = input.value.replace(/\D/g, '')
    
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10)
    }

    let formatted = ''
    if (cleaned.length > 0) {
      formatted = '(' + cleaned.substring(0, 3)
    }
    if (cleaned.length >= 4) {
      formatted += ') ' + cleaned.substring(3, 6)
    }
    if (cleaned.length >= 7) {
      formatted += '-' + cleaned.substring(6, 10)
    }

    input.value = formatted
  }
}
