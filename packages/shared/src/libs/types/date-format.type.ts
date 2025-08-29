import { type DateTimeFormat } from "../enums/enums.js";
import { type ValueOf } from "./types.js";

type DateFormat = ValueOf<typeof DateTimeFormat>;

export { type DateFormat };
