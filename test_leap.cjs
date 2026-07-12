const DateObjectModule = require('react-date-object');
const persianModule = require('react-date-object/calendars/persian');

const DateObject = DateObjectModule.default || DateObjectModule;
const persian = persianModule.default || persianModule;

const d1 = new DateObject({ year: 1402, month: 1, day: 1, calendar: persian });
const d2 = new DateObject({ year: 1403, month: 1, day: 1, calendar: persian });

console.log("1402 isLeap:", d1.isLeap);
console.log("1403 isLeap:", d2.isLeap);
