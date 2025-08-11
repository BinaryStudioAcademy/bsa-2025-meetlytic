import { type RegisterUser } from "../controllers/auth-controller";
import {
	assembleEmail,
	type EmailOptions,
	generateDomainPart,
	generateLocalPart,
} from "./email-generator";
import {
	type FirstnLastNameOptions,
	generateFirstName,
	generateLastName,
} from "./first-last-name-generator";
import { generatePassword, type PasswordOptions } from "./password-generator";

const generateFakeUser = (
	options: EmailOptions = {},
	fnloptions: FirstnLastNameOptions = {},
	pwOptions: PasswordOptions = {},
): RegisterUser => {
	const firstName = generateFirstName(fnloptions);
	const lastName = generateLastName(fnloptions);
	const password = generatePassword(pwOptions);

	const localPart = generateLocalPart(options);
	const domainPart = generateDomainPart(options);
	const email = assembleEmail(localPart, domainPart, options);

	return {
		confirmPassword: password,
		email,
		firstName,
		lastName,
		password,
	};
};

export { generateFakeUser };
