import { ValueOf } from "@meetlytic/shared";

import { UserAttribute as UserAttributeEnum } from "../enums/enums.js";

type UserAttribute = ValueOf<typeof UserAttributeEnum>;

export { type UserAttribute };
