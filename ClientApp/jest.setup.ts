// jestSetup.ts

jest.mock("expo-font");

// jest.setup.js
global.setImmediate = global.setImmediate || ((fn: (...args: any[]) => void, ...args: any) => setTimeout(fn, 0, ...args));
global.clearImmediate = global.clearImmediate || clearTimeout;
