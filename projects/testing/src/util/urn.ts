export const createUrn = () => {
  const force = randomIntFromRange(10, 99).toString();
  const unit = 'GD';
  const number = randomIntFromRange(10000, 99999).toString();
  const suffix = new Date()
    .getFullYear()
    .toString()
    .slice(2);

  function randomIntFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return `${force}${unit}${number}${suffix}`;
};
