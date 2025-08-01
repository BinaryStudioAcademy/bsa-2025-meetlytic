import { type CreateStack } from "./types.js";

type CloudFormation = {
	create(payload: CreateStack): Promise<string>;
	delete(meetingId: number): Promise<void>;
};

export { type CloudFormation };
