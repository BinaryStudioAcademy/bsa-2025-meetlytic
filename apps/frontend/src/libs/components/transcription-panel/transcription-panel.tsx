import { Loader, SearchBar } from "~/libs/components/components.js";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useMeetingSocket,
	useMemo,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

import styles from "./transcription-panel.module.css";

type Properties = {
	meetingId: number;
	meetingStatus: string;
};

const TranscriptionPanel: React.FC<Properties> = ({
	meetingId,
	meetingStatus,
}: Properties) => {
	const dispatch = useAppDispatch();
	const [searchTerm, setSearchTerm] = useState("");
	const { dataStatus, transcriptions } = useAppSelector(
		({ transcription }) => transcription,
	);

	const containerReference = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const containerBootom = containerReference.current;

		if (!containerBootom) {
			return;
		}

		containerBootom.scrollIntoView();
	}, [transcriptions.items]);

	useEffect(() => {
		void dispatch(transcriptionActions.getTranscriptionsByMeetingId(meetingId));
	}, [dispatch, meetingId]);

	useMeetingSocket(
		meetingId,
		(data) => {
			dispatch(transcriptionActions.addTranscription(data));
		},
		meetingStatus,
	);

	const filteredTranscriptions = useMemo(() => {
		return transcriptions.items.filter((transcription) =>
			transcription.chunkText.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [transcriptions, searchTerm]);

	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	return (
		<div className={styles["meeting-details__transcription-panel"]}>
			<div className={styles["panel-header"]}>
				<div className={styles["panel-header__text"]}>TRANSCRIPT</div>
				<SearchBar onSearch={handleSearch} />
			</div>
			{dataStatus === DataStatus.PENDING && <Loader isLoading />}
			{filteredTranscriptions.length > EMPTY_ARRAY_LENGTH ? (
				<div className={styles["transcription-area"]}>
					{filteredTranscriptions.map((transcription) => (
						<p className={styles["transcription-text"]} key={transcription.id}>
							{transcription.chunkText}
						</p>
					))}
					<div ref={containerReference} />
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
