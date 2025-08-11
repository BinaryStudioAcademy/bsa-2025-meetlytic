import { generateDomainPart } from './email-generator';
import { generateLocalPart } from './email-generator';
import { assembleEmail } from './email-generator';
import { EmailOptions } from './email-generator';
import { generateFirstName, generateLastName } from './first-last-name-generator';
import { FirstnLastNameOptions } from './first-last-name-generator';
import { generatePassword, PasswordOptions } from './password-generator';

export const generateFakeUser = (label: string, options: EmailOptions = {}, fnloptions: FirstnLastNameOptions = {}, pwOptions: PasswordOptions = {}) => {
	const firstName = generateFirstName(fnloptions);
	const lastName = generateLastName(fnloptions);
	const password = generatePassword(pwOptions);

	const localPart = generateLocalPart(options);
	const domainPart = generateDomainPart(options);
	const email = assembleEmail(localPart, domainPart, label, options);

	return {
		firstName,
		lastName,
		email,
		password,
		confirmPassword: password,
	};
};
