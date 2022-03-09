// @ts-nocheck

export function newID() {
  return (Math.random() * Math.pow(2, 54)).toString(20);
}
