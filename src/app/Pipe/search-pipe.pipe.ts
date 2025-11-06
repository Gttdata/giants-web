import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})

export class SearchPipePipe implements PipeTransform {
  transform(value: any, args?: any, key?: any): any {
    if (!args) {
      return value;
    }

    if (key == "MEMBER_NAME") {
      return value.filter((value: any) => {
        return (value.MEMBER_NAME.toLocaleLowerCase().includes(args));
      })

    } else if (key == "AWARD") {
      return value.filter((value: any) => {
        return (value.AWARD_NAME.toLocaleLowerCase().includes(args));
      })

    } else if (key == "CERTIFICATE") {
      return value.filter((value: any) => {
        return (value.CERTIFICATE_NAME.toLocaleLowerCase().includes(args));
      })

    } else {
      return value.filter((value: any) => {
        return (value.NAME.toLocaleLowerCase().includes(args));
      })
    }
  }
}
