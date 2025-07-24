import { type UserResponseDto } from "~/modules/users/user.service.js";

declare module "fastify" {
	interface FastifyRequest {
		user?: null | UserResponseDto;
	}
}
