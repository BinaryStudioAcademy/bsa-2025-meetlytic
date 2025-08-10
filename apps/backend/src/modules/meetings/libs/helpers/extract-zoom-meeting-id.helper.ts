const NOT_FOUND = -1;
const NEXT_INDEX_OFFSET = 1;
const MEETING_ID_REGEX = /^\d{9,11}$/;

function isJoinSegment(segment: string): boolean {
	return segment === "j" || segment === "join";
}

function isValidMeetingId(id: string | undefined): id is string {
	return !!id && MEETING_ID_REGEX.test(id);
}

const extractZoomMeetingId = (url: string): null | string => {
	const parsedUrl = new URL(url);
	const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

	const joinIndex = pathParts.findIndex((segment) => isJoinSegment(segment));

	if (
		joinIndex === NOT_FOUND ||
		joinIndex + NEXT_INDEX_OFFSET >= pathParts.length
	) {
		return null;
	}

	const meetingId = pathParts[joinIndex + NEXT_INDEX_OFFSET];

	if (!isValidMeetingId(meetingId)) {
		return null;
	}

	return meetingId;
};

export { extractZoomMeetingId };
