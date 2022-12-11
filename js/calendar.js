function makeCalendar(date, yearMonth, moveYearInput, scheduleArray, clickedDay = false) {
  const currentYear = date.getFullYear(); // 현재 연
  const currentMonth = date.getMonth() + 1; // 현재 월
  const currentStartDay = new Date(currentYear, date.getMonth(), 1).getDay(); // 현재 월 시작 요일
  const currentLastDate = new Date(currentYear, currentMonth, 0).getDate(); // 현재 월 마지막 일
  const currentLastDay = new Date(currentYear, currentMonth, 0).getDay(); // 현재 월 마지막 요일

  // 현재 실행되어있는 연, 월 표시
  let YEARMONTH = `${currentYear} ${String(currentMonth).padStart(2, "0")}`;
  yearMonth.innerText = YEARMONTH;
  moveYearInput.value = currentYear;

  const prevLastDate = new Date(currentYear, currentMonth - 1, 0).getDate(); // 이전 월 마지막 일

  const weekCount = Math.ceil((currentStartDay + currentLastDate) / 7);
  let makeHtml = '';
  let count = 0;
  let makeDate = 1;
  for (let i = 0; i < weekCount; i++) {
    makeHtml += "<tr>";
    for (let j = 0; j < 7; j++) {
      makeHtml += "<td>";
      if ( currentStartDay <= count && makeDate <= currentLastDate) {
        let CURRENT = `day${currentYear}${String(currentMonth).padStart(2, "0")}${String(makeDate).padStart(2, "0")}`;
        makeHtml += `<div id="${CURRENT}">${makeDate}</div>`;
        makeDate++;
      }
      makeHtml += "</td>";
      count++;
    }
    makeHtml += "</tr>";
  }

  document.querySelector('#calendar > tbody').innerHTML = makeHtml;

  if ( currentStartDay > 0 ) {
    for (let i = 0; i < currentStartDay; i++) {
      let PREVDAY = prevLastDate - currentStartDay + 1 + i;
      let PREV = `day${currentYear}${String(currentMonth - 1).padStart(2, "0")}${String(PREVDAY).padStart(2, "0")}`;
      document.querySelector("#calendar > tbody > tr:first-child").childNodes[i].innerHTML = `<div id="${PREV}" class="near">${PREVDAY}</div>`;
    }
  }

  if ( currentLastDay < 6 ) {
    for (let i = 0; i < 6 - currentLastDay; i++) {
      let NEXT = `day${currentYear}${String(currentMonth + 1).padStart(2, "0")}${String(i + 1).padStart(2, "0")}`;
      document.querySelector(`#calendar > tbody > tr:last-child > td:nth-last-child(${(6 - currentLastDay) - i})`).innerHTML = `<div id="${NEXT}" class="near">${i + 1}</div>`;
    }
  }

  // 오늘 날짜, 클릭한 날짜 달력에 표시
  const today = new Date();
  const todayId = `day${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  if ( currentYear === today.getFullYear() && (currentMonth - 1) === today.getMonth() ) { // 오늘 날짜 표시
    document.getElementById(todayId).classList.add("today");
  }
  if ( !clickedDay &&  document.getElementById(todayId) !== null) { // 최초 실행 시 오늘 날짜에 표시
    document.getElementById(todayId).classList.add("select");
    scheduleDate.innerText = `${todayId.slice(3, 7)} ${todayId.slice(7, 9)} ${todayId.slice(9, 11)}`;
  } else if ( document.getElementById(clickedDay) ) { // 선택한 날짜가 현재 달력에 해당할 경우 표시
    document.getElementById(clickedDay).classList.add("select");
    scheduleDate.innerText = `${clickedDay.slice(3, 7)} ${clickedDay.slice(7, 9)} ${clickedDay.slice(9, 11)}`;
  }

  // 현재 달력에 스케줄 표시하는 클래스 생성
  let currentCalendar = [];
  let startNum = new Date(currentYear, currentMonth - 2, prevLastDate - currentStartDay);
  for ( let i = 0; i < weekCount * 7; i++ ) {
    startNum.setDate(startNum.getDate() + 1 );
    currentCalendar.push(`${startNum.getFullYear()}${String(startNum.getMonth()+1).padStart(2, "0")}${String(startNum.getDate()).padStart(2, "0")}`);
  }
  let currentDateObject = scheduleArray.filter( (schedule) => currentCalendar.includes(schedule.date) );

  let currentDateArray = [];
  for ( let i = 0; i < currentDateObject.length; i++ ) {
    currentDateArray.push(currentDateObject[i].date);
  }
  currentDateArray = [... new Set( currentDateArray )];

  let createNum;
  for ( let i = 0; i < currentDateArray.length; i++ ) {
    createNum = currentDateObject.filter( (obj) => obj.date === currentDateArray[i] ).length;
    let createHtml = document.createElement("div");
    let innerTag = "";
    for ( let j = 0; j < createNum; j++ ) {
      if ( j < 3 ) {
        innerTag += "<span></span>";
      }
    }
    createHtml.innerHTML = innerTag;
    document.getElementById(`day${currentDateArray[i]}`).appendChild(createHtml);
  }
}

function selectDayEvent(selectId, scheduleDate, makeSchedule, scheduleArray, scheduleList) {
  const selected = document.getElementsByClassName("select");
  if ( selected.length > 0 ) {
    selected[0].classList.remove("select");
  }
  document.getElementById(selectId).classList.add("select");
  scheduleDate.innerText = `${selectId.slice(3, 7)} ${selectId.slice(7, 9)} ${selectId.slice(9, 11)}`;

  let currentDate = scheduleDate.innerText.replace(/ /gi,"");
  makeSchedule(scheduleArray, currentDate, scheduleList);

  return selectId;
}

export { makeCalendar, selectDayEvent };