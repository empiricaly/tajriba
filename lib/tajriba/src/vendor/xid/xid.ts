// @ts-nocheck

export function newID() {
  return (Math.random() * Math.pow(2, 54)).toString(20);
}

// // import "os" from "os";
// // import "crypto" from "crypto";
// // import { random } from "@lukeed/csprng";
// import { encodeString } from "./base32";

// function randInt() {
//   return (Math.random() * Math.pow(2, 54)).toString(36);
//   // return random(3).readUIntBE(0, 3);
// }

// function machineId() {
//   return randInt();
//   // const hostname = os.hostname();
//   // if (undefined === hostname) {
//   //   return randInt();
//   // }
//   return crypto
//     .createHash("md5")
//     .update(hostname)
//     .digest()
//     .slice(0, 3)
//     .readUIntBE(0, 3);
// }

// const mid = machineId();
// const pid = process.pid & 0xffff;
// let seq = randInt();
// let time = (Date.now() / 1000) | 0;

// const buff = Buffer.allocUnsafe(12).fill(0);
// buff.writeUInt32BE(time, 0);
// buff.writeUIntBE(mid, 4, 3);
// buff.writeUInt16BE(pid, 7);

// /**
//  * Generate a unique id.
//  *
//  * @returns {string}
//  */
// export function newID() {
//   const now = (Date.now() / 1000) | 0;
//   if (time !== now) {
//     buff.writeUInt32BE(now, 0);
//     time = now;
//   }
//   const c = seq & 0xffffff;
//   seq += 1;
//   buff.writeUIntBE(c, 9, 3);
//   return encodeString(buff).substring(0, 20);
// }
