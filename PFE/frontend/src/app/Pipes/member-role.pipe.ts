import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberRole',
  standalone: true
})
export class MemberRolePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Product_Owner': return 'Product Owner';
      case 'Scrum_Master': return 'SCRUM Master';
      case 'Developer': return 'Developer';
      case 'Tester': return 'Tester';
      default: return 'Unknown Role';
    }
  }
}
