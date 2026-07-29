import { Pipe, PipeTransform } from '@angular/core';
import { mapRefDataJudiciaryToJudiciaryType } from '../helpers/judiciary-type.helper';
import { JudicialMember } from '../reference-data.interfaces';

@Pipe({
  name: 'judicialMemberName',
  standalone: true
})
export class JudicialMemberNamePipe implements PipeTransform {
  transform(judiciary: JudicialMember): string {
    if (!judiciary) {
      return '';
    }

    if (
      mapRefDataJudiciaryToJudiciaryType(judiciary.judiciaryType) === 'DEPUTY_DISTRICT_JUDGE' ||
      mapRefDataJudiciaryToJudiciaryType(judiciary.judiciaryType) === 'RECORDER'
    ) {
      return this.getNameForRecorderAndDDJ(judiciary);
    }

    return this.getNameForAllJudiciaryTypes(judiciary);
  }

  private getNameForRecorderAndDDJ(judiciary: JudicialMember): string {
    return judiciary.requestedName || '';
  }

  private getNameForAllJudiciaryTypes(judiciary: JudicialMember): string {
    let result = '';

    if (judiciary.titlePrefix) {
      result += judiciary.titlePrefix + ' ';
    }
    if (judiciary.titleJudicialPrefix) {
      result += judiciary.titleJudicialPrefix + ' ';
    }
    result += judiciary.surname.toLocaleUpperCase();

    if (judiciary.titleSuffix) {
      result += ' ' + judiciary.titleSuffix;
    }
    return result;
  }
}
