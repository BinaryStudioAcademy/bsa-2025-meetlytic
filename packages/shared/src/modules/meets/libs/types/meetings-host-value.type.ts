import { MeetingHost } from "../enums/enums.js";

type MeetingHostValue = (typeof MeetingHost)[keyof typeof MeetingHost];

export type { MeetingHostValue };
