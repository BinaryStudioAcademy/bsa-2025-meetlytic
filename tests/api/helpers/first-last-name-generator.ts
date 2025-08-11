import { faker } from '@faker-js/faker';
import { getRandomChars } from './get-random-chars';

const ONE_CHAR = 1;
const FIFTY = 50;
const FIFTY_ONE = 51;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const symbols = '!\\"#$%&\'()*+,-./:;<=>?@[\\\\]^_`{|}~';
const digits = '0123456789';

const randomChar = getRandomChars(digits, ONE_CHAR);
const randomSymbol = getRandomChars(symbols, ONE_CHAR);
const fiftyoneLetterName = getRandomChars(alphabet, FIFTY_ONE);
const fiftyLetterName = getRandomChars(alphabet, FIFTY);

// Used for generating different scenarios
export type FirstnLastNameOptions = {
	digitFirstName?: boolean;
	digitLastName?: boolean;
	emptyFirstName?: boolean;
	emptyLastName?: boolean;
	fiftyLetterFirstName?: boolean;
	fiftyLetterLastName?: boolean;
	fiftyoneLetterFirstName?: boolean;
	fiftyoneLetterLastName?: boolean;
	singleCharFirstName?: boolean;
	singleCharLastName?: boolean;
	symbolFirstname?: boolean;
	symbolLastname?: boolean;
	withHyphenFirstName?: boolean;
	withHyphenLastName?: boolean;
	withSpacesFirstName?: boolean;
	withSpacesLastName?: boolean;
};
function generateFirstName(options: FirstnLastNameOptions = {}): string {
	if (options.singleCharFirstName) {
		// Return a single random char as first name
		return getRandomChars(alphabet, ONE_CHAR);
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
		firstName = '';
	}

	return firstName;
}

function generateLastName(options: FirstnLastNameOptions = {}): string {
	if (options.singleCharLastName) {
		// Return a single random char as last name
		return getRandomChars(alphabet, ONE_CHAR);
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

export { generateFirstName, generateLastName };
