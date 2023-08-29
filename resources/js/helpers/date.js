export function dateToStr(date) {
  let isoString = date.toISOString(); // Contoh: "2023-08-28T12:53:21.123Z"
  return isoString.replace(/\.(\d{3})Z$/, `.$10000Z`);
}

// let dateObj = new Date();
// let laravelString = dateToStr(dateObj);

// console.log(laravelString); 