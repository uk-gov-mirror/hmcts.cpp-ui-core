import { Pipe, PipeTransform } from '@angular/core';
import { RotaBusinessType } from '@cpp/reference-data';

@Pipe({
  name: 'businessTypeDescription',
  standalone: true
})
export class BusinessTypeDescriptionPipe implements PipeTransform {
  transform(typeCode: string, rotaBusinessTypesByCode: Record<string, RotaBusinessType>): string {
    const rotaBusinessType = rotaBusinessTypesByCode[typeCode];
    return rotaBusinessType ? rotaBusinessType.typeDescription : '';
  }
}
