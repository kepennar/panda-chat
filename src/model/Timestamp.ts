import { struct } from "superstruct/lib/index.js";

export const TimestampStruct = struct({
  seconds: "number",
  nanoseconds: "number",
});
