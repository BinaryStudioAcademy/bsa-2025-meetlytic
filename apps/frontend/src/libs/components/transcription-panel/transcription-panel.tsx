import { Loader, SearchBar } from "~/libs/components/components.js";
import { DataStatus, MeetingStatus, SocketEvent } from "~/libs/enums/enums.js";
import {
	useAppSelector,
	useAutoScroll,
	useCallback,
	useFetchTranscriptions,
	useMeetingSocket,
	useMemo,
	useSearchParams,
	useTypingQueue,
} from "~/libs/hooks/hooks.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

import { LiveTranscription } from "./components/live-transcription/live-transcription.js";
import styles from "./transcription-panel.module.css";

type Properties = {
	meetingId: number;
	meetingStatus: string;
};

const EMPTY_TRANSCRIPT_CHUNKS = 0;

const TranscriptionPanel: React.FC<Properties> = ({
	meetingId,
	meetingStatus,
}: Properties) => {
	const { isTyping, onAddChunk, typedText } = useTypingQueue();
	const containerReference = useAutoScroll<HTMLDivElement>([typedText]);
	const { dataStatus, transcriptions } = useAppSelector(
		({ transcription }) => transcription,
	);

	const [searchParameters] = useSearchParams();
	const token = searchParameters.get("token");

	const handleTranscriptUpdate = useCallback(
		(newChunk: MeetingTranscriptionResponseDto) => {
			onAddChunk(newChunk);
		},
		[onAddChunk],
	);

	useFetchTranscriptions({
		meetingId,
		token,
	});

	useMeetingSocket<MeetingTranscriptionResponseDto>({
		callback: handleTranscriptUpdate,
		event: SocketEvent.TRANSCRIBE,
		meetingId,
		meetingStatus,
	});

	const handleSearch = useCallback(() => {
		// TODO: implement handleSearch logic
	}, []);

	const staticTranscript = useMemo(() => {
		return transcriptions.items
			.map((transcription) => transcription.chunkText)
			.join(" ");
	}, [transcriptions.items]);

	return (
		<div className={styles["meeting-details__transcription-panel"]}>
			<div className={styles["panel-header"]}>
				<div className={styles["panel-header__text"]}>TRANSCRIPT</div>
				<SearchBar onSearch={handleSearch} />
			</div>
			{dataStatus === DataStatus.PENDING && <Loader isLoading />}

			{transcriptions.items.length > EMPTY_TRANSCRIPT_CHUNKS ? (
				<div className={styles["transcription-area"]} ref={containerReference}>
					<p className={styles["transcription-text"]}>
						{staticTranscript}
						{meetingStatus === MeetingStatus.STARTED && (
							<LiveTranscription isTyping={isTyping} typedText={typedText} />
						)}
					</p>
				</div>
			) : (
				<div className={styles["no-transcriptions"]}>
					<p>No transcriptions</p>
				</div>
			)}
		</div>
	);
};

export { TranscriptionPanel };
