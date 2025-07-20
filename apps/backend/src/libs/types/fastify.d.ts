import { UserResponseDto } from "@meetlytic/shared";

declare module "fastify" {
	interface FastifyRequest {
		user: null | UserResponseDto;
	}
}
