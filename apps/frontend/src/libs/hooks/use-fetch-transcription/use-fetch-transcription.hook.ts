import { useAppDispatch, useEffect } from "~/libs/hooks/hooks.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

type UseFetchTranscriptionsParameters = {
	meetingId: number;
	token?: null | string;
};

const useFetchTranscriptions = ({
	meetingId,
	token,
}: UseFetchTranscriptionsParameters): void => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!meetingId) {
			return;
		}

		if (token) {
			void dispatch(
				transcriptionActions.getTranscriptionsBySignedUrl({
					meetingId: String(meetingId),
					token,
				}),
			);
		} else {
			void dispatch(
				transcriptionActions.getTranscriptionsByMeetingId(meetingId),
			);
		}
	}, [dispatch, meetingId, token]);
};

export { useFetchTranscriptions };
