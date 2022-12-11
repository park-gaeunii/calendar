const title = document.getElementById('title');
const memo = document.getElementById('memo');

const startYear = document.getElementById('startYear');
const startMonth = document.getElementById('startMonth');
const startDay = document.getElementById('startDay');
const startHour = document.getElementById('startHour');
const startMinute = document.getElementById('startMinute');

const lastYear = document.getElementById('lastYear');
const lastMonth = document.getElementById('lastMonth');
const lastDay = document.getElementById('lastDay');
const lastMinute = document.getElementById('lastMinute');

const year = document.querySelectorAll('#startYear, #lastYear');
const month = document.querySelectorAll('#startMonth, #lastMonth');
const day = document.querySelectorAll('#startDay, #lastDay');

const lastDateWrap = document.getElementById('lastDateWrap');

// const repeat = document.getElementById('repeat');

let minuteHtml = "";
function initSchedule(scheduleArray, scheduleDate, scheduleList, lastHour) {
  if ( scheduleArray ) {
    let currentDate = scheduleDate.innerText.replace(/ /gi,"");
    makeSchedule(scheduleArray, currentDate, scheduleList);
  }

  let hourHtml = "";
  for ( let i = 0; i < 24; i++) {
    let num = String(i).padStart(2, "0");
    hourHtml += `<option value="${i}">${num}</option>`;
  }
  startHour.innerHTML = hourHtml;
  lastHour.innerHTML = `<option value="none">---</option>${hourHtml}`;
  
  for ( let i = 0; i < 60; i+=5) {
    let num = String(i).padStart(2, "0");
    minuteHtml += `<option value="${i}">${num}</option>`;
  }
  startMinute.innerHTML = minuteHtml;
  lastMinute.innerHTML = `<option value="none">---</option>`;
  
  month.forEach( (month)  => month.addEventListener("change", (event) => {
    let tagId = event.target.id.slice(0, -5);
    let year = document.getElementById(`${tagId}Year`).value;
    let changeMonth = event.target.selectedIndex + 1;
    let dayHtml = makeDay( year, changeMonth );
    document.getElementById(`${tagId}Day`).innerHTML = dayHtml;
    document.getElementById(`${tagId}Day`).options[0].selected = true;
  }));
}

function makeSchedule(scheduleArray, currentDate, scheduleList) {
  let currentDateList = scheduleArray.filter( (schedule) => schedule.date === currentDate );
  scheduleList.innerHTML = "";
  for (let i = 0; i < currentDateList.length; i++) {
    let createHtml = document.createElement("li");
    createHtml.innerHTML = `<div data-id="${currentDateList[i].id}" class="list">${currentDateList[i].name}<span>${currentDateList[i].time}</span><i>${currentDateList[i].memo}</i></div>`;
    scheduleList.appendChild(createHtml);
  }
}


let editDataId;
let editAllday;
function openWritePage(save, write, deleteButton, cancel, scheduleDate, allday) {
  editDataId = false;
  write.style.display = "block";
  deleteButton.style.display = "none";
  save.innerText = "SAVE";
  cancel.innerText = "CANCEL";
  document.querySelectorAll(".writeForm input, .writeForm textarea, .writeForm select").forEach( (form) => {
    form.disabled = false;
  });
  document.querySelectorAll(".time > div:last-child").forEach( (time) => {
    time.style.display = "block";
  });
  document.querySelectorAll(".time").forEach( (time) => {
    time.classList.remove("disabled");
  });
  allday.parentNode.style.display = "block";
  allday.checked = false;

  title.value = "";
  memo.value = "";

  const scheduleDateSplit = scheduleDate.innerText.split(' ');
  const selectYear = scheduleDateSplit[0];
  for (let i = 1; i < scheduleDateSplit.length; i++) {
    let check = scheduleDateSplit[i].startsWith("0");
    if ( check ) {
      scheduleDateSplit[i] = scheduleDateSplit[i].slice(1);
    }
  }
  const selectMonth = scheduleDateSplit[1];
  const selectDay = scheduleDateSplit[2];

  year.forEach( (year) => {
    year.value = selectYear;
  });

  let monthHtml = "";
  for ( let i = 0; i < 12; i++) {
    let num = String(i+1).padStart(2, "0");
    monthHtml += `<option value="${i+1}">${num}</option>`;
  }
  month.forEach( (month) => {
    month.innerHTML = monthHtml;
    month.options[selectMonth-1].selected = true;
  });

  let dayHtml = makeDay( selectYear, selectMonth );
  day.forEach( (day) => {
    day.innerHTML = dayHtml;
    day.options[selectDay - 1].selected = true;
  });
}
function openEditPage(event, save, write, deleteButton, cancel, scheduleArray, lastHour) {
  let tagClass = event.target.closest(".list");
  if ( tagClass ) {
    write.style.display = "block";
    deleteButton.style.display = "block";
    save.innerText = "EDIT";
    cancel.innerText = "BACK";
    document.querySelectorAll(".writeForm input, .writeForm textarea, .writeForm select").forEach( (form) => {
      form.disabled = true;
    });
    document.querySelectorAll(".time").forEach( (time) => {
      time.classList.add("disabled");
    });
    document.querySelector(".allday").style.display = "none";

    editDataId = Number( tagClass.dataset.id );
    let currentSchedule = scheduleArray.filter( (schedule) => schedule.id === editDataId );
    editAllday = currentSchedule[0].allday;

    title.value = currentSchedule[0].name;
    memo.value = currentSchedule[0].memo;

    let currentDate = [
      [ currentSchedule[0].date.slice(0, 4), currentSchedule[0].date.slice(4, 6), currentSchedule[0].date.slice(6, 8) ]
    ];

    let timeIndex = [];

    if ( currentSchedule.length > 1 ) { // 당일 이벤트가 아니라면
      currentDate.push([
        currentSchedule[currentSchedule.length - 1].date.slice(0, 4),
        currentSchedule[currentSchedule.length - 1].date.slice(4, 6),
        currentSchedule[currentSchedule.length - 1].date.slice(6, 8),
        currentSchedule[currentSchedule.length - 1].time
      ]);
      timeIndex.push( currentSchedule[0].time, currentSchedule[currentSchedule.length - 1].time );
    } else { // 당일 이벤트
      currentDate.push(currentDate[0]);

      timeIndex = currentSchedule[0].time.split(" - ");
      if ( currentSchedule[0].allday || currentSchedule[0].time.split(" - ").length === 1 ) {
        timeIndex.push("");
      }
    }

    if ( !timeIndex[0] ) {
      timeIndex[0] = "00:00"
    }
    if ( !timeIndex[1] ) {
      timeIndex[1] = "-1:00"
      lastMinute.innerHTML = `<option value="none">---</option>`;
    } else {
      lastMinute.innerHTML = minuteHtml;
    }

    for ( let i = 0; i < 2; i++ ) {
      timeIndex[i] = timeIndex[i].split(":");
      
      for ( let j = 1; j < 3; j++ ) {
        if ( currentDate[i][j].startsWith("0") ) {
          currentDate[i][j] = currentDate[i][j].slice(1);
        }
        if ( timeIndex[i][j-1].startsWith("0") ) {
          timeIndex[i][j-1] = timeIndex[i][j-1].slice(1)
        }
      }
      timeIndex[i][1] = Number(timeIndex[i][1]) / 5;
    }

    let monthHtml = "";
    for ( let i = 0; i < 12; i++) {
      let num = String(i+1).padStart(2, "0");
      monthHtml += `<option value="${i+1}">${num}</option>`;
    }
    month.forEach( (month) => {
      month.innerHTML = monthHtml;
    });
    
    let startDayHtml = makeDay( currentDate[0][0], currentDate[0][1] );
    let lastDayHtml = makeDay( currentDate[1][0], currentDate[1][1] );

    startYear.value = currentDate[0][0];
    lastYear.value = currentDate[1][0];
    startMonth.options[ Number(currentDate[0][1])-1 ].selected = true;
    lastMonth.options[ Number(currentDate[1][1])-1 ].selected = true;
    startDay.innerHTML = startDayHtml;
    startDay.options[ Number(currentDate[0][2])-1 ].selected = true;
    lastDay.innerHTML = lastDayHtml;
    lastDay.options[ Number(currentDate[1][2])-1 ].selected = true;

    if ( currentSchedule[0].allday ) { // 종일
      document.querySelectorAll(".time > div:last-child").forEach( (time) => {
        time.style.display = "none";
      });
    } else {
      document.querySelectorAll(".time > div:last-child").forEach( (time) => {
        time.style.display = "block";
      });

      startHour.options[ Number(timeIndex[0][0]) ].selected = true;
      startMinute.options[ Number(timeIndex[0][1]) ].selected = true;
      lastHour.options[ Number(timeIndex[1][0]) +1 ].selected = true;
      lastMinute.options[ Number(timeIndex[1][1]) ].selected = true;
    }
  }
}

function selectDateChange(event, allday, lastHour) {
  let tag = event.target.id.startsWith("start") ? "start" : "last";
  let check = checkTime(allday, lastHour);
  let startTime = check.start;
  let lastTime = check.last;
  let classNot = check.classNot;

  if ( startTime > lastTime ) {
    if ( tag === "start" && !classNot ) {
      lastYear.value = startYear.value;
      lastMonth.options[startMonth.selectedIndex].selected = true;
      lastDay.options[startDay.selectedIndex].selected = true;
      if ( !allday.checked && lastHour.selectedIndex !== 0 ) { 
        lastHour.options[startHour.selectedIndex + 1].selected = true;
        lastMinute.options[startMinute.selectedIndex].selected = true;
      }
    } else { // last
      lastDateWrap.classList.add("not");
    }
  } else if ( startTime <= lastTime && classNot ) {
    lastDateWrap.classList.remove("not");
  }
}

let lastMinuteValue = 0;
function setLastMinute(event) {
  if ( lastMinuteValue === 0 && event.target.selectedIndex !== 0 ) {
    lastMinute.innerHTML = minuteHtml;
  } else if ( lastMinuteValue !== 0 && event.target.selectedIndex === 0 ) {
    lastMinute.innerHTML = `<option value="none">---</option>`;
  }
  lastMinuteValue = event.target.selectedIndex;
}

function alldayCheck(event, allday, lastHour) {
  if ( event.target.checked ) {
    document.querySelectorAll(".time > div:last-child > select").forEach( (select) => select.disabled = true );
  } else {
    document.querySelectorAll(".time > div:last-child > select").forEach( (select) => select.disabled = false );
  }

  let check = checkTime(allday, lastHour);
  let startTime = check.start;
  let lastTime = check.last;
  let classNot = check.classNot;

  if ( startTime > lastTime ) {
    lastDateWrap.classList.add("not");
  } else if ( startTime <= lastTime && classNot ) {
    lastDateWrap.classList.remove("not");
  }
}

function deleteEvent(scheduleArray, setSchedule, scheduleList, scheduleDate, write) {
  scheduleArray = scheduleArray.filter( (schedule) => schedule.id !== editDataId );
  localStorage.setItem( "schedule", JSON.stringify(scheduleArray) );
  setSchedule();
  let currentDate = scheduleDate.innerText.replace(/ /gi,"");
  makeSchedule(scheduleArray, currentDate, scheduleList);
  write.style.display = "none";
}

function saveEvent(event, allday, scheduleArray, scheduleDate, scheduleList, lastHour, setSchedule,  makeCalendar, date, yearMonth, moveYearInput, clickedDay) {
  const action = event.target.innerText;
  if (action === "SAVE") {
    if ( lastDateWrap.classList.contains("not") ) {
      alert("시작 날짜는 종료 날짜 이전이어야 합니다.");
    } else {
      if (editDataId) {
        scheduleArray = scheduleArray.filter( (schedule) => schedule.id !== editDataId );
      }
      let eventTitle = title.value;
      let eventMemo = memo.value;
      if ( title.value.replace(/ /gi,"").length === 0 ) {
        eventTitle = "새로운 일정";
      }
      if ( memo.value.replace(/ /gi,"").length === 0 ) {
        eventMemo = "";
      }
      let eventTime = "";
      let alldayChecked = true;
      let startHourText = startHour.options[startHour.selectedIndex].text;
      let startMinuteText = startMinute.options[startMinute.selectedIndex].text;
      let lastHourText = lastHour.options[lastHour.selectedIndex].text;
      let lastMinuteText = lastMinute.options[lastMinute.selectedIndex].text;
      if ( !allday.checked ) {
        alldayChecked = false;
        if ( lastHour.selectedIndex === 0 || startHourText === lastHourText && startMinuteText === lastMinuteText ) {
          eventTime = `${startHourText}:${startMinuteText}`;
        } else {
          eventTime = `${startHourText}:${startMinuteText} - ${lastHourText}:${lastMinuteText}`;
        }
      }
  
      let check = checkTime(allday, lastHour);
      let startDate = check.startDate;
      let lastDate = check.lastDate;
      let different = (lastDate - startDate) / ( 1000*60*60*24 );
  
      let dateId = `${startDate.getFullYear()}${String(startDate.getMonth()+1).padStart(2, "0")}${String(startDate.getDate()).padStart(2, "0")}`;
  
      for (let i = 0; i < different+1; i++) {
        let currentObject = {
          date: dateId,
          id: Date.now(),
          name: eventTitle,
          memo: eventMemo,
          allday: alldayChecked
        };
        if ( different === 0 ) { // 당일 선택일 때
          currentObject.time = eventTime;
          scheduleArray.push( currentObject );
        } else { // 기간 선택일 때
          if ( i === 0 ) { // 첫 날
            currentObject.time = eventTime.split(" - ")[0];
            scheduleArray.push( currentObject );
          } else if ( i === different ) { // 마지막 날
            currentObject.date = `${lastDate.getFullYear()}${String(lastDate.getMonth()+1).padStart(2, "0")}${String(lastDate.getDate()).padStart(2, "0")}`;
            if ( eventTime.split(" - ")[1] ) {
              currentObject.time = `${eventTime.split(" - ")[1]} <i>종료</i>`;
            } else {
              currentObject.time = "";
            }
            scheduleArray.push( currentObject );
          } else {
            startDate.setDate(startDate.getDate() + 1 );
            currentObject.date = `${startDate.getFullYear()}${String(startDate.getMonth()+1).padStart(2, "0")}${String(startDate.getDate()).padStart(2, "0")}`;
            currentObject.time = "";
            scheduleArray.push( currentObject );
          }
        }
      }
      localStorage.setItem( "schedule", JSON.stringify(scheduleArray) );
      setSchedule();
      makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay);
      let currentDate = scheduleDate.innerText.replace(/ /gi,"");
      makeSchedule(scheduleArray, currentDate, scheduleList);
      write.style.display = "none";
    }
  } else { // edit
    save.innerText = "SAVE";
    cancel.innerText = "CANCEL";
    document.querySelectorAll(".writeForm input, .writeForm textarea, .time > div:first-child select").forEach( (form) => {
      form.disabled = false;
    });
    document.querySelectorAll(".time").forEach( (time) => {
      time.classList.remove("disabled");
    });
    document.querySelectorAll(".time > div:last-child").forEach( (time) => {
      time.style.display = "block";
    });
    document.querySelector(".allday").style.display = "block";
    if (editAllday) {
      allday.checked = true;
      document.querySelectorAll(".time > div:last-child select").forEach( (form) => {
        form.disabled = true;
      });
    } else {
      allday.checked = false;
      document.querySelectorAll(".time > div:last-child select").forEach( (form) => {
        form.disabled = false;
      });
    }
    console.log(editAllday);
  }
}

function makeDay( year, month ) {
  let dayHtml = "";
  let num = new Date( year, month, 0).getDate();
  for ( let i = 0; i < num; i++) {
    let num = String(i+1).padStart(2, "0");
    dayHtml += `<option value="${i+1}">${num}</option>`;
  }
  return dayHtml;
}

function checkTime(allday, lastHour) {
  let selected = {
    start: [
      startYear.value,
      startMonth.selectedIndex,
      startDay.options[startDay.selectedIndex].value
    ],
    last: [
      lastYear.value,
      lastMonth.selectedIndex,
      lastDay.options[lastDay.selectedIndex].value
    ]
  }

  let startDate= new Date( ... selected.start );
  let lastDate = new Date( ... selected.last );

  if ( !allday.checked ) {
    selected.start.push( startHour.options[startHour.selectedIndex].value, startMinute.options[startMinute.selectedIndex].value );
    if ( lastHour.selectedIndex === 0 ) {
      selected.last.push( "11", "59" );
    } else {
      selected.last.push( lastHour.options[lastHour.selectedIndex].value, lastMinute.options[lastMinute.selectedIndex].value );
    }
  }

  let startTime = new Date( ... selected.start );
  let lastTime = new Date( ... selected.last );

  const classNot = lastDateWrap.classList.contains('not');

  return {
    startDate: startDate,
    lastDate: lastDate,
    start: startTime,
    last: lastTime,
    classNot: classNot
  };
}

export { initSchedule, makeSchedule, openWritePage, openEditPage, selectDateChange, setLastMinute, alldayCheck, deleteEvent, saveEvent };