import { PlayerTrack } from "~/libs/components/components.js";
import { useParams } from "~/libs/hooks/hooks.js";

const MeetingDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<>
			<div>Meeting Nº {id}</div>
			<div>
				<PlayerTrack audioUrl="https://audio-samples.github.io/samples/mp3/wavenet_unconditional/voxceleb2/sample-5.mp3" />
			</div>
		</>
	);
};

export { MeetingDetails };
