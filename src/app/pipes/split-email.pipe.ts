import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitEmail'
})
export class SplitEmailPipe implements PipeTransform {

  transform(testEmail: string, by: string): string {
    let pos: number = testEmail.indexOf('@') | 0;
    let str1: string = testEmail.substr(0, pos);
    let str2: string = testEmail.substr(pos, testEmail.length);
    return str1 + ' ' + str2;
  }

}
