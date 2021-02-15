const date = require("../src/utils/date");

test("Converts 60 seconds to 1 minute", () => {
    expect(date.toMinutes(60 * 1000)).toBe(1);
});

test("Converts 60 minutes to 1 hour", () => {
    expect(date.toHours(3600 * 1000)).toBe(1);
});

test("Converts 24 hours to 1 day", () => {
    expect(date.toDays(24 * 3600 * 1000)).toBe(1);
});
