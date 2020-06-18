const toMinutes = date => (date / 1000) / 60
const toHours = date => (date / 1000) / 3600
const toDays = date => ((date / 1000) / 3600) / 24

export { toMinutes, toHours, toDays }
