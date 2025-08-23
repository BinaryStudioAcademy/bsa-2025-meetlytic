import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useSearchParams,
} from "~/libs/hooks/hooks.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

const useFetchTranscriptions = (): void => {
	const dispatch = useAppDispatch();
	const meetingId = useAppSelector((state) => state.meetingDetails.meeting?.id);
	const [searchParameters] = useSearchParams();
	const token = searchParameters.get("token");

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
