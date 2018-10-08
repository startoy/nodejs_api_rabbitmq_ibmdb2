`use strict`;

function randomid1() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

function randomid2() {
  return (
    new Date().getTime().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

function isNumber(victim) {
  // is type number( ex. "123" , 123) AND not null with "" (which is string null)
  if (
    typeof Number(victim) === 'number' &&
    Math.floor(Number(victim)) === Number(victim) &&
    victim !== ''
  )
    return 1;
  return 0;
}

module.exports = {
  randomid1: randomid1,
  randomid2: randomid2,
  isNumber: isNumber
};
