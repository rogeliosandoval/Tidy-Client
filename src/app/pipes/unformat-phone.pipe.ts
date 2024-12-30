import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'unformatPhone',
  standalone: true
})

export class UnformatPhonePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return ''
    return value.replace(/\D/g, '') // Remove all non-digit characters
  }
  
}
