import { config } from "~/libs/modules/config/config.js";

import { BaseEncrypt } from "./base-encrypt.module.js";

const encrypt = new BaseEncrypt(config.ENV.ENCRYPT.SALT_ROUNDS);

export { encrypt };
