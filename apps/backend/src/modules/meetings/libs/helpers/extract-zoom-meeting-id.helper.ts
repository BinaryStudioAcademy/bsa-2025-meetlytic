const NOT_FOUND = -1;
const NEXT_INDEX_OFFSET = 1;
const MEETING_ID_REGEX = /^\d{9,11}$/;

const isJoinSegment = (segment: string): boolean => {
	return segment === "j" || segment === "join";
};

const isValidMeetingId = (id: string | undefined): id is string => {
	return Boolean(id) && MEETING_ID_REGEX.test(id as string);
};

const extractZoomMeetingId = (url: string): null | string => {
	const parsedUrl = new URL(url);
	const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

	const joinIndex = pathParts.findIndex((segment) => isJoinSegment(segment));
	const meetingIdIndex = joinIndex + NEXT_INDEX_OFFSET;

	if (joinIndex === NOT_FOUND || meetingIdIndex >= pathParts.length) {
		return null;
	}

	const meetingId = pathParts[meetingIdIndex];

	if (!isValidMeetingId(meetingId)) {
		return null;
	}

	return meetingId;
};

export { extractZoomMeetingId };
