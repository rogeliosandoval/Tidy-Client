import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'phone',
  standalone: true
})

export class FormatPhonePipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) return ''

    // Convert the input to a string
    const phone = value.toString().replace(/\D/g, '')

    // Ensure we have exactly 10 digits
    if (phone.length !== 10) {
      return value.toString() // Return the input as is if it doesn't have exactly 10 digits
    }

    // Format the phone number as (xxx) xxx-xxxx
    const formatted = `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`
    return formatted
  }

}
