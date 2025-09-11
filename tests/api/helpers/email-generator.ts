import {
	generateRandomNameLikeString,
	getRandomChars,
} from "./get-random-chars";

const LOCAL_SPECIAL_CHARS = "0123456789_'+-.";

const LOCAL_ONE_CHAR =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'+-";

const LOCAL_PART_LENGTH = 6;

const DOMAIN_SEGMENT2_LENGTH = 4;

const DOMAIN_SEGMENT3_LENGTH = 5;

const DEFAULT_TLD_LENGTH = 3;

const LONG_TLD_LENGTH = 15;

const SINGLE_CHAR_LENGTH = 1;

// Used for generating different scenarios
type EmailOptions = {
	consecutiveDotsInDomain?: boolean;
	consecutiveDotsInLocal?: boolean;
	domainHyphensAtEnd?: boolean;
	domainHyphensAtStart?: boolean;
	emojiInDomain?: boolean;
	emojiInLocal?: boolean;
	emptyEmail?: boolean;
	fourPartDomain?: boolean;
	localEndsWithDot?: boolean;
	localStartsWithDot?: boolean;
	longTld?: boolean;
	missingDomainPart?: boolean;
	missingLocalPart?: boolean;
	singleCharLocal?: boolean;
	tldTooShort?: boolean;
	withSpaces?: boolean;
};

function assembleEmail(
	localPart: string,
	domainPart: string,
	options: EmailOptions,
): string {
	if (options.emptyEmail) {
		return "";
	}

	if (options.missingLocalPart) {
		return `@${domainPart}`;
	}

	if (options.missingDomainPart) {
		return `${localPart}@`;
	}

	let email = `${localPart}@${domainPart}`;

	if (options.withSpaces) {
		email = ` ${email} `;
	}

	return email;
}

function generateDomainPart(options: EmailOptions): string {
	let segment1 = getRandomChars(
		"abcdefghijklmnopqrstuvwxyz0123456789",
		LOCAL_PART_LENGTH,
	);
	let segment2 = getRandomChars(
		"abcdefghijklmnopqrstuvwxyz0123456789",
		DOMAIN_SEGMENT2_LENGTH,
	);

	if (options.emojiInDomain) {
		segment1 = `😀${segment1}`;
	}

	// default tld leength
	let tldLength = DEFAULT_TLD_LENGTH;

	// if longTld option is true, use 15 characters, else use 3
	if (options.longTld) {
		tldLength = LONG_TLD_LENGTH;
	} else if (options.tldTooShort) {
		tldLength = SINGLE_CHAR_LENGTH;
	}

	const tld = getRandomChars(
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		tldLength,
	);

	// Handle hyphens at start/end
	if (options.domainHyphensAtEnd) {
		const addHyphenAtEnd = (s: string): string => s + "-";
		segment1 = addHyphenAtEnd(segment1);
		segment2 = addHyphenAtEnd(segment2);
	} else if (options.domainHyphensAtStart) {
		const addHyphenAtStart = (s: string): string => "-" + s;
		segment1 = addHyphenAtStart(segment1);
		segment2 = addHyphenAtStart(segment2);
	}

	if (options.fourPartDomain) {
		const segment3 = getRandomChars(
			"abcdefghijklmnopqrstuvwxyz0123456789",
			DOMAIN_SEGMENT3_LENGTH,
		);

		return `${segment1}.${segment2}.${segment3}.${tld}`;
	}

	if (options.consecutiveDotsInDomain) {
		// consecutive dots between segments
		return `${segment1}..${segment2}.${tld}`;
	}

	// normal doomian part
	return `${segment1}.${segment2}.${tld}`;
}

function generateLocalPart(options: EmailOptions): string {
	const randomLocalChar = getRandomChars(
		LOCAL_SPECIAL_CHARS,
		SINGLE_CHAR_LENGTH,
	);

	if (options.emojiInLocal) {
		return `${generateRandomNameLikeString(LOCAL_PART_LENGTH)}😀${randomLocalChar}${generateRandomNameLikeString(LOCAL_PART_LENGTH)}`;
	}

	if (options.singleCharLocal) {
		return getRandomChars(LOCAL_ONE_CHAR, SINGLE_CHAR_LENGTH);
	}

	if (options.consecutiveDotsInLocal) {
		return `${generateRandomNameLikeString(LOCAL_PART_LENGTH)}..${randomLocalChar}${generateRandomNameLikeString(LOCAL_PART_LENGTH)}`;
	}

	if (options.localStartsWithDot) {
		return `.${generateRandomNameLikeString(LOCAL_PART_LENGTH)}${randomLocalChar}${generateRandomNameLikeString(LOCAL_PART_LENGTH)}`;
	}

	if (options.localEndsWithDot) {
		const randomLocalChar = getRandomChars(
			LOCAL_SPECIAL_CHARS,
			SINGLE_CHAR_LENGTH,
		);

		return `${generateRandomNameLikeString(LOCAL_PART_LENGTH)}${randomLocalChar}${generateRandomNameLikeString(LOCAL_PART_LENGTH)}.`;
	}

	return `${generateRandomNameLikeString(LOCAL_PART_LENGTH)}${randomLocalChar}${generateRandomNameLikeString(LOCAL_PART_LENGTH)}`;
}

export { assembleEmail, generateDomainPart, generateLocalPart };
export { type EmailOptions };
