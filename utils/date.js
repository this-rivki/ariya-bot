/**
 * @module helpers/date-helper
 */

/**
 * Convert Formated number to add 0 before the number
 *
 * @example
 * prependZero('1')
 * // => '01'
 *
 * @param  {String} val Number to convert
 * @return {String} Positif integer number string
 */
const prependZero = function (val) {
  const number = parseInt(val)
  if (number < 10) {
    return '0' + number.toString()
  }
  return number.toString()
}
module.exports.prependZero = prependZero

const day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
module.exports.day = day

const dayShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
module.exports.dayShort = dayShort
const daySuperShort = ['Mn', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb']
module.exports.daySuperShort = daySuperShort
const workdays = ['Sn', 'Sl', 'Rb', 'Km', 'Jm']
module.exports.workdays = workdays
const weekend = ['Mn', 'Sb']
module.exports.weekend = weekend

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]
module.exports.months = months

const monthShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agt',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]
module.exports.monthShort = monthShort

const TIMEZONE_NAMES = {
  'UTC+0': 'GMT',
  'UTC+1': 'CET',
  'UTC+2': 'EET',
  'UTC+3': 'EEDT',
  'UTC+3.5': 'IRST',
  'UTC+4': 'MSD',
  'UTC+4.5': 'AFT',
  'UTC+5': 'PKT',
  'UTC+5.5': 'IST',
  'UTC+6': 'BST',
  'UTC+6.5': 'MST',
  'UTC+7': 'WIB',
  'UTC+8': 'WITA',
  'UTC+9': 'WIT',
  'UTC+9.5': 'ACST',
  'UTC+10': 'AEST',
  'UTC+10.5': 'ACDT',
  'UTC+11': 'AEDT',
  'UTC+11.5': 'NFT',
  'UTC+12': 'NZST',
  'UTC-1': 'AZOST',
  'UTC-2': 'GST',
  'UTC-3': 'BRT',
  'UTC-3.5': 'NST',
  'UTC-4': 'CLT',
  'UTC-4.5': 'VET',
  'UTC-5': 'EST',
  'UTC-6': 'CST',
  'UTC-7': 'MST',
  'UTC-8': 'PST',
  'UTC-9': 'AKST',
  'UTC-9.5': 'MIT',
  'UTC-10': 'HST',
  'UTC-11': 'SST',
  'UTC-12': 'BIT',
}

/**
 * Return Date
 *
 * @param  {Date} date
 *
 * @return {Date}
 */
module.exports.getDaysInMonth = function (date) {
  const getDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return getDay.getDate()
}

/**
 * Return year is leap
 *
 * @param {Date} date
 */
module.exports.isLeapYear = function (date) {
  let month, year
  month = date.getMonth()
  year = date.getFullYear()

  if (month === 1) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return true
    }
  }
  return false
}

/**
 *
 * @param {*} dateObject
 */
module.exports.getOnlyDate = function (dateObject) {
  return (
    dateObject.getFullYear() +
    '-' +
    prependZero(dateObject.getMonth() + 1) +
    '-' +
    prependZero(dateObject.getDate())
  )
}

/**
 *
 * @param {*} value
 */
module.exports.getTimeString = function (value) {
  let dateString, timeString
  dateString =
    value.year + '-' + prependZero(value.month) + '-' + prependZero(value.day)
  timeString =
    prependZero(value.hour) +
    ':' +
    prependZero(value.minute) +
    ':' +
    prependZero(value.second)
  return dateString + 'T' + timeString
}

module.exports.isValidDate = function (dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/
  return dateString.match(regEx) !== null
}

/**
 * Returns human readable timestamp format
 *
 * @example
 * humanizeTimestamp('2017-06-23T14:15:53.886+07:00', '%day% %dd% %mmm% %yyyy% - %hh%:%mi% WIB')
 * // => Jumat 23 Jun 2017 - 14:15 WIB
 *
 * @param  {String|Date} timestamp timestamp format
 * @param  {String} format specific wanted format to humanize the timestamp (in-casesensitive)
 *
 * @return {String}
 */
module.exports.humanizeTimestamp = function (
  timestamp,
  format = '%day%, %dd% %month% %yyyy%'
) {
  const dateTime = new Date(timestamp)
  const offset = (-1 * dateTime.getTimezoneOffset()) / 60
  const dataOffset = `UTC${offset >= 0 ? `+${offset}` : offset}`
  const timezone = TIMEZONE_NAMES[dataOffset]
  const timeMapping = {
    '%hh%': `0${dateTime.getHours()}`.slice(-2),
    '%mi%': `0${dateTime.getMinutes()}`.slice(-2),
    '%dd%': `0${dateTime.getDate()}`.slice(-2),
    '%day%': day[dateTime.getDay()],
    '%mm%': `0${dateTime.getMonth() + 1}`.slice(-2),
    '%mmm%': monthShort[dateTime.getMonth()],
    '%month%': months[dateTime.getMonth()],
    '%yyyy%': dateTime.getFullYear(),
    '%tz%': timezone,
  }
  return format.replace(/%(.*?)%/gi, (n) => timeMapping[n])
}
