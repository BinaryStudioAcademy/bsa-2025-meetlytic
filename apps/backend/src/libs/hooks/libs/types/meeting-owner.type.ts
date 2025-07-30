import {
	type FastifyReply,
	type FastifyRequest,
	type HookHandlerDoneFunction,
} from "fastify";

type MeetingOwnerHook = (
	request: FastifyRequest,
	reply: FastifyReply,
	done: HookHandlerDoneFunction,
) => void;

export { type MeetingOwnerHook };
