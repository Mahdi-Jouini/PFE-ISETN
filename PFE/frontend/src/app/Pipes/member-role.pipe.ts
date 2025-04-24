import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberRole',
  standalone: true
})
export class MemberRolePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0: return 'Product Owner';
      case 1: return 'SCRUM Master';
      case 2: return 'Developer';
      case 3: return 'Tester';
      default: return 'Unknown Role';
    }
  }
}
