export async function randomid1() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

export async function randomid2() {
  return new Date().getTime().toString() + Math.random().toString() + Math.random().toString();
}