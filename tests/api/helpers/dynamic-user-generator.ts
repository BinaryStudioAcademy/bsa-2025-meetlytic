import { generateDomainPart, generateLocalPart, assembleEmail, type EmailOptions } from './email-generator';
import { generateFirstName, generateLastName, type FirstnLastNameOptions } from './first-last-name-generator';
import { generatePassword, PasswordOptions } from './password-generator';

const generateFakeUser = (label: string, options: EmailOptions = {}, fnloptions: FirstnLastNameOptions = {}, pwOptions: PasswordOptions = {}) => {
	const firstName = generateFirstName(fnloptions);
	const lastName = generateLastName(fnloptions);
	const password = generatePassword(pwOptions);

	const localPart = generateLocalPart(options);
	const domainPart = generateDomainPart(options);
	const email = assembleEmail(localPart, domainPart, label, options);

	return {
		confirmPassword: password,
		firstName,
		lastName,
		email,
		password,
	};
};

export { generateFakeUser };
