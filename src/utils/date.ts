const toMinutes = (date: number) => (date / 1000) / 60;
const toHours = (date: number) => (date / 1000) / 3600;
const toDays = (date: number) => ((date / 1000) / 3600) / 24;

export { toMinutes, toHours, toDays };
