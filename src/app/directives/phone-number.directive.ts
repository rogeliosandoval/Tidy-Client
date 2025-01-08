import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[phoneNumber]',
  standalone: true
})

export class PhoneNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    // Prevent default paste behavior
    event.preventDefault()

    const input = event.target as HTMLInputElement
    const clipboardData = event.clipboardData || (window as any).clipboardData
    let pastedData = clipboardData?.getData('text') || ''

    // Remove non-numeric characters from the pasted data
    let cleaned = pastedData.replace(/\D/g, '')

    // Limit to 10 digits
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10)
    }

    // Format the cleaned value
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

    // Set the formatted value in the input field
    input.value = formatted

    // Update the underlying form control value with the cleaned numeric value
    const inputEvent = new Event('input', { bubbles: true })
    input.dispatchEvent(inputEvent)
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

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
