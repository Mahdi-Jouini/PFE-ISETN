import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'issuePriority',
  standalone: true
})
export class IssuePriorityPipe implements PipeTransform {

  transform(value: string): number {
    switch (value) {
      case 'Zero': return 0;
      case 'One': return 1;
      case 'Two': return 2;
      case 'Three': return 3;
      case 'Five': return 5;
      case 'Eight': return 8;
      case 'Thirteen': return 13;
      case 'Twenty': return 20;
      case 'Forty': return 40;
      case 'OneHundred': return 100
      default: return 0;
    }
  }

}
