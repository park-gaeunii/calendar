import { makeCalendar, selectDayEvent } from "./calendar.js";
import { initSchedule, makeSchedule, openWritePage, openEditPage, setLastMinute, alldayCheck, selectDateChange, deleteEvent, saveEvent } from "./schedule.js";

const selectDay = document.querySelector("#calendar > tbody");
const prevMonth = document.getElementById('previousMonth');
const nextMonth = document.getElementById('nextMonth');
const goToday = document.getElementById('today');
const yearMonth = document.getElementById('yearMonth');
const moveDate = document.getElementById('moveDate');
const moveYearInput = document.getElementById("moveYear");
const yearInputDelete = document.getElementById("textDelete");
const moveYearButton = document.querySelectorAll("#moveBtn > button");
const moveMonth = document.querySelectorAll("#moveDate > ul > li");

const scheduleDate = document.getElementById('scheduleDate');
const scheduleList  = document.getElementById('scheduleList');
const open = document.getElementById('openWrite');
const write = document.getElementById('write');
const cancel = document.getElementById('cancel');
const save = document.getElementById('save');
const deleteButton = document.getElementById('delete'); // delete 기능 추가
const allday = document.getElementById('allday');
const selectDate = document.querySelectorAll('.time input, .time select');
const lastHour = document.getElementById('lastHour');

let date = new Date();

let scheduleArray = [];
setSchedule();
function setSchedule() {
  const savedSchedule = JSON.parse( localStorage.getItem("schedule") );
  if ( savedSchedule !== null ) {
    scheduleArray = savedSchedule;
  }
}
makeCalendar(date, yearMonth, moveYearInput, scheduleArray);
initSchedule(scheduleArray, scheduleDate, scheduleList, lastHour);

console.log(scheduleArray);

// calendar
let clickedDay = false;
prevMonth.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay);
});

nextMonth.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay);
});

goToday.addEventListener("click", () => {
  date = new Date();
  makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay);
});

selectDay.addEventListener("click", (event) => {
  let selectId = event.target.id;
  if (selectId) {
    clickedDay = selectDayEvent(selectId, scheduleDate, makeSchedule, scheduleArray, scheduleList);
  }
});

// 상단 연월 클릭 시 이벤트
let moveDateState = false;
yearMonth.addEventListener("click", () => {
  moveDate.style.display = "block";
  moveDateState = true;
});

moveYearInput.addEventListener("mousedown", () => {
  yearInputDelete.style.display = "block";
});

yearInputDelete.addEventListener("click", () => {
  moveYearInput.value = "";
  moveYearInput.focus();
});

let currentValue = "";
document.addEventListener("mousedown", (event) => {
  if ( moveDateState ) {
    if ( event.target.id !== "yearMonth" && !event.target.closest("#moveDate") ) {
      moveDate.style.display = "none";
      moveDateState = false;
      currentValue = moveYearInput.value;
      if ( currentValue.length < 4 ) {
        moveYearInput.value = yearMonth.innerText.slice(0, 4);
      }
    }
  }
});

document.addEventListener("mouseup", (event) => {
  if ( moveDateState ) {
    if ( event.target.id !== "moveYear" && event.target.id !== "textDelete" ) {
      yearInputDelete.style.display = "none";
      moveYearInput.blur();
      currentValue = moveYearInput.value;
      if ( currentValue.length < 4 ) {
        moveYearInput.value = yearMonth.innerText.slice(0, 4);
      }
    }
  }
});

moveYearInput.addEventListener("keyup", (key) => {
  currentValue = moveYearInput.value;
  let numCheck = currentValue.replace(/[^0-9]/g, "");
  if ( currentValue !==  numCheck ) {
    moveYearInput.value = numCheck;
  }
  if ( key.key === "Enter" ) {
    yearInputDelete.style.display = "none";
    moveYearInput.blur();
    currentValue = moveYearInput.value;
    if ( currentValue.length < 4 ) {
      moveYearInput.value = yearMonth.innerText.slice(0, 4);
    }
  }
});

moveYearButton.forEach( (moveBtn) => moveBtn.addEventListener("click", (event) => {
  if ( event.target.id === "nextYear" ) {
    moveYearInput.value = Number(moveYearInput.value) + 1;
  } else {
    moveYearInput.value = Number(moveYearInput.value) - 1;
  }
}));

moveMonth.forEach( (move) => move.addEventListener("click", (event) => {
  date.setFullYear(moveYearInput.value);
  date.setMonth(Number(event.target.innerText) - 1);
  moveDate.style.display = "none";
  makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay);
}));

// schedule
open.addEventListener("click", () => {
  openWritePage(save, write, deleteButton, cancel, scheduleDate, allday);
});

scheduleList.addEventListener("click", (event) => {
  openEditPage(event, save, write, deleteButton, cancel, scheduleArray, lastHour);
});

cancel.addEventListener("click", () => {
  write.style.display = "none";
});

allday.addEventListener("change", (event) => {
  alldayCheck(event, allday, lastHour);
});

selectDate.forEach( (select)  => select.addEventListener("change", (event) => {
  selectDateChange(event, allday, lastHour);
}));

lastHour.addEventListener("change", (event) => {
  setLastMinute(event);
});

save.addEventListener("click", (event) => {
  saveEvent(event, allday, scheduleArray, scheduleDate, scheduleList, lastHour, setSchedule, makeCalendar, date, yearMonth, moveYearInput, clickedDay);
});

deleteButton.addEventListener("click", () => {
  deleteEvent(scheduleArray, setSchedule, scheduleList, scheduleDate, write);
  makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay);
});