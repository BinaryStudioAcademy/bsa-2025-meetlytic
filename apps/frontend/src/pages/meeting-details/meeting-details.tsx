import { Button, PlayerTrack } from "~/libs/components/components.js";
import { useAppDispatch, useCallback, useParams } from "~/libs/hooks/hooks.js";
import { actions as meetingActions } from "~/modules/meeting/meeting.js";

const MeetingDetails: React.FC = () => {
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();

	const stopRecording = useCallback(() => {
		void dispatch(meetingActions.stopRecording({ id: id as string }));
	}, [dispatch, id]);

	return (
		<>
			<div>Meeting Nº {id}</div>
			<Button label="Stop Recording" onClick={stopRecording} />
			<div>
				<PlayerTrack audioUrl="https://audio-samples.github.io/samples/mp3/wavenet_unconditional/voxceleb2/sample-5.mp3" />
			</div>
		</>
	);
};

export { MeetingDetails };
