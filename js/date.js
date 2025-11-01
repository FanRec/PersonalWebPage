const dateElem = document.getElementById("date");
const clockElem = document.getElementById("clock");

const weekdayArr = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const weekday = date.getDay();
  dateElem.textContent = `${year}/${month}/${day}/ ${weekdayArr[weekday]}`;
  const formatHour = hour.toString().padStart(2, "0");
  const formatMinute = minute.toString().padStart(2, "0");
  const formatSecond = second.toString().padStart(2, "0");
  clockElem.textContent = `${formatHour}:${formatMinute}:${formatSecond}`;
}
function loopUpdateDate() {
  getDate();
  setTimeout(loopUpdateDate, 1000);
}
