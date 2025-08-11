import { getRandomChars } from './get-random-chars';
import { faker } from '@faker-js/faker';

// Used for generating different scenarios
export type FirstnLastNameOptions = {
	singleCharFirstName?: boolean;
	singleCharLastName?: boolean;
	withSpacesFirstName?: boolean;
	withSpacesLastName?: boolean;
	withHyphenFirstName?: boolean;
	withHyphenLastName?: boolean;
	digitFirstName?: boolean;
	digitLastName?: boolean;
	symbolFirstname?: boolean;
	symbolLastname?: boolean;
	fiftyoneLetterFirstName?: boolean;
	fiftyoneLetterLastName?: boolean;
	fiftyLetterFirstName?: boolean;
	fiftyLetterLastName?: boolean;
	emptyFirstName?: boolean;
	emptyLastName?: boolean;
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const symbols = '!\\"#$%&\'()*+,-./:;<=>?@[\\\\]^_`{|}~';
const digits = '0123456789';
const randomChar = getRandomChars(digits, 1);
const randomSymbol = getRandomChars(symbols, 1);
const fiftyoneLetterName = getRandomChars(alphabet, 51);
const fiftyLetterName = getRandomChars(alphabet, 50);

export function generateFirstName(options: FirstnLastNameOptions = {}): string {
	if (options.singleCharFirstName) {
		// Return a single random char as first name
		return getRandomChars(alphabet, 1);
	}

	let firstName = faker.person.firstName();

	if (options.withSpacesFirstName) {
		firstName = `  ${firstName}  `;
	}

	if (options.withHyphenFirstName) {
		firstName = `${firstName}-${firstName}`;
	}
	if (options.digitFirstName) {
		firstName = `${randomChar}${firstName}`;
	}
	if (options.symbolFirstname) {
		firstName = `${randomSymbol}${firstName}`;
	}
	if (options.fiftyLetterFirstName) {
		firstName = `${fiftyLetterName}`;
	}
	if (options.fiftyoneLetterFirstName) {
		firstName = `${fiftyoneLetterName}`;
	}
	if (options.emptyFirstName) {
		firstName = ``;
	}
	return firstName;
}

export function generateLastName(options: FirstnLastNameOptions = {}): string {
	if (options.singleCharLastName) {
		// Return a single random char as last name
		return getRandomChars(alphabet, 1);
	}

	let lastName = faker.person.lastName();

	if (options.withSpacesLastName) {
		lastName = `  ${lastName}  `;
	}
	if (options.withHyphenLastName) {
		lastName = `${lastName}-${lastName}`;
	}
	if (options.digitLastName) {
		lastName = `${randomChar}${lastName}`;
	}
	if (options.symbolLastname) {
		lastName = `${randomSymbol}${lastName}`;
	}
	if (options.fiftyLetterLastName) {
		lastName = `${fiftyLetterName}`;
	}
	if (options.fiftyoneLetterLastName) {
		lastName = `${fiftyoneLetterName}`;
	}
	if (options.emptyLastName) {
		lastName = ``;
	}
	return lastName;
}
