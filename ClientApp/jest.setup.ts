// jestSetup.ts
import { TextEncoder, TextDecoder } from "util";
jest.mock("expo-font");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
// jest.setup.js
global.setImmediate = global.setImmediate || ((fn: (...args: any[]) => void, ...args: any) => setTimeout(fn, 0, ...args));
global.clearImmediate = global.clearImmediate || clearTimeout;


