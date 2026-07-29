import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationPipe',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(duration: number): string {
    if (duration === 0) return '0';

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationText: string[] = [];

    if (hours > 0) {
      durationText.push(`${hours} hour${hours === 1 ? '' : 's'}`);
    }
    if (minutes > 0) {
      durationText.push(`${minutes} min${minutes === 1 ? '' : 's'}`);
    }

    return durationText.join(' ');
  }
}
