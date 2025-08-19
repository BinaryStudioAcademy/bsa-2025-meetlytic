import { z } from "zod";

const meetingId = z.object({
	id: z.coerce.number().int().positive(),
});

export { meetingId };
