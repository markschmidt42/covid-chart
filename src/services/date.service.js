const ensureDate = (date) => {
  // console.log('ensureDate: date', date);
  if (date instanceof Date) {
    return date;
  }
  // console.log('not date');
  const newDate = new Date();
  // console.log('ensureDate: newDate', newDate);
  newDate.setDate(date);
  return newDate;
};

const subtract = (date, days) => {
  // console.log('subtract', date, days);
  if (days === 0) {
    return ensureDate(date);
  }

  const newDate = new Date();
  newDate.setDate(date.getDate() - days);
  return newDate;
};

const today = () => new Date();

const yesterday = () => subtract(today(), 1);

const parse = (stringDate) => {
  const dateParts = stringDate.split('/');
  return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
};

const format = (date) => {
  // console.log('date', date);
  const theDate = ensureDate(date);
  const day = theDate.getDate();
  const month = theDate.getMonth() + 1;
  const year = String(theDate.getFullYear()).substr(-2);

  return `${month}/${day}/${year}`;
};

export default {
  getLastDate() {
    // returns '4/1/20'
    return format(yesterday());
  },

  today,
  yesterday,
  format,
  ensureDate,
  parse,
  subtract,
};
