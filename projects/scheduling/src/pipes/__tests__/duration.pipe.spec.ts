import { DurationPipe } from '../duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "0" when duration is 0', () => {
    expect(pipe.transform(0)).toBe('0');
  });

  it('should return minutes only when duration is less than 60', () => {
    expect(pipe.transform(5)).toBe('5 mins');
    expect(pipe.transform(1)).toBe('1 min');
  });

  it('should return hours only when duration is a multiple of 60', () => {
    expect(pipe.transform(60)).toBe('1 hour');
    expect(pipe.transform(120)).toBe('2 hours');
  });

  it('should return both hours and minutes when duration is more than 60', () => {
    expect(pipe.transform(61)).toBe('1 hour 1 min');
    expect(pipe.transform(125)).toBe('2 hours 5 mins');
  });

  it('should handle edge cases correctly', () => {
    expect(pipe.transform(59)).toBe('59 mins');
    expect(pipe.transform(121)).toBe('2 hours 1 min');
  });
});
