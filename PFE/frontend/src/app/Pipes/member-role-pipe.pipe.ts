import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberRolePipe'
})
export class MemberRolePipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
