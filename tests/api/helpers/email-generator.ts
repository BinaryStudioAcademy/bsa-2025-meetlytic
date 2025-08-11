import { getRandomChars } from './get-random-chars';
import { generateRandomNameLikeString } from './get-random-chars';

// Used for generating different scenarios
export type EmailOptions = {
	consecutiveDotsInLocal?: boolean;
	consecutiveDotsInDomain?: boolean;
	withSpaces?: boolean;
	singleCharLocal?: boolean;
	fourPartDomain?: boolean;
	longTld?: boolean;
	domainHyphensAtEnd?: boolean;
	domainHyphensAtStart?: boolean;
	emptyEmail?: boolean;
	missingLocalPart?: boolean;
	missingDomainPart?: boolean;
	localStartsWithDot?: boolean;
	localEndsWithDot?: boolean;
	tldTooShort?: boolean;
	emojiInLocal?: boolean;
	emojiInDomain?: boolean;
};

const localSpecialChars = "0123456789_'+-.";
const localOneChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'+-";

export function generateLocalPart(options: EmailOptions): string {
	const randomLocalChar = getRandomChars(localSpecialChars, 1);

	if (options.emojiInLocal) {
		return `${generateRandomNameLikeString(6)}😀${randomLocalChar}${generateRandomNameLikeString(6)}`;
	}
	if (options.singleCharLocal) {
		return getRandomChars(localOneChar, 1);
	}
	if (options.consecutiveDotsInLocal) {
		return `${generateRandomNameLikeString(6)}..${randomLocalChar}${generateRandomNameLikeString(6)}`;
	}
	if (options.localStartsWithDot) {
		return `.${generateRandomNameLikeString(6)}${randomLocalChar}${generateRandomNameLikeString(6)}`;
	}
	if (options.localEndsWithDot) {
		const randomLocalChar = getRandomChars(localSpecialChars, 1);
		return `${generateRandomNameLikeString(6)}${randomLocalChar}${generateRandomNameLikeString(6)}.`;
	}
	// normal local part
	return `${generateRandomNameLikeString(6)}${randomLocalChar}${generateRandomNameLikeString(6)}`;
}

export function generateDomainPart(options: EmailOptions): string {
	let segment1 = getRandomChars('abcdefghijklmnopqrstuvwxyz0123456789', 6);
	let segment2 = getRandomChars('abcdefghijklmnopqrstuvwxyz0123456789', 4);

	if (options.emojiInDomain) {
		segment1 = `😀${segment1}`;
	}

	// default tld leength
	let tldLength = 3;

	// if longTld option is true, use 15 characters, else use 3
	if (options.longTld) {
		tldLength = 15;
	} else if (options.tldTooShort) {
		tldLength = 1;
	}

	const tld = getRandomChars('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', tldLength);

	// Handle hyphens at start/end
	if (options.domainHyphensAtEnd) {
		const addHyphenAtEnd = (s: string) => s + '-';
		segment1 = addHyphenAtEnd(segment1);
		segment2 = addHyphenAtEnd(segment2);
	} else if (options.domainHyphensAtStart) {
		const addHyphenAtStart = (s: string) => '-' + s;
		segment1 = addHyphenAtStart(segment1);
		segment2 = addHyphenAtStart(segment2);
	}

	if (options.fourPartDomain) {
		const segment3 = getRandomChars('abcdefghijklmnopqrstuvwxyz0123456789', 5);
		return `${segment1}.${segment2}.${segment3}.${tld}`;
	}

	if (options.consecutiveDotsInDomain) {
		// consecutive dots between segments
		return `${segment1}..${segment2}.${tld}`;
	}
	// normal doomian part
	return `${segment1}.${segment2}.${tld}`;
}

export function assembleEmail(localPart: string, domainPart: string, label: string, options: EmailOptions): string {
	if (options.emptyEmail) return '';

	if (options.missingLocalPart) return `@${domainPart}`;

	if (options.missingDomainPart) return `${localPart}@`;

	let email = `${localPart}@${domainPart}`;

	if (options.withSpaces) {
		email = ` ${email} `;
	}

	return email;
}
