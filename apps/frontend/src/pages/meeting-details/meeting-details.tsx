import {
	Button,
	Icon,
	Loader,
	SearchInput,
	useParams,
	useSearchParams,
} from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppForm,
	useCallback,
	useEffect,
	useState,
} from "~/libs/hooks/hooks.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type MeetingResponseDto } from "~/modules/meeting/meeting.js";
import { meetingApi } from "~/modules/meeting/meeting.js";

import styles from "./styles.module.css";

const MeetingDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [searchParameters] = useSearchParams();
	const dispatch = useAppDispatch();

	const [meeting, setMeeting] = useState<MeetingResponseDto | null>(null);
	const [dataStatus, setDataStatus] = useState<ValueOf<typeof DataStatus>>(
		DataStatus.IDLE,
	);
	const [error, setError] = useState<null | string>(null);
	const { control, errors } = useAppForm({
		defaultValues: {
			search: "",
		},
	});

	useEffect(() => {
		const fetchMeetingDetails = async (): Promise<void> => {
			if (!id) {
				setError("Meeting ID is missing.");
				setDataStatus(DataStatus.REJECTED);

				return;
			}

			setDataStatus(DataStatus.PENDING);
			setError(null);

			try {
				const shareToken = searchParameters.get("token");

				const fetchedMeeting: MeetingResponseDto = shareToken
					? await meetingApi.getMeetingById(Number(id), shareToken)
					: await meetingApi.getMeetingById(Number(id));

				// TODO: console.log("fetchedMeeting: ", fetchedMeeting);

				setMeeting(fetchedMeeting);
				setDataStatus(DataStatus.FULFILLED);
				// eslint-disable-next-line sonarjs/no-ignored-exceptions, unicorn/prefer-optional-catch-binding, @typescript-eslint/no-unused-vars
			} catch (error_: unknown) {
				// TODO: console.log("Failed to fetch meeting details:", error_);
				setError("Failed to load meeting details. Please try again.");
				setDataStatus(DataStatus.REJECTED);
			}
		};

		void fetchMeetingDetails();
	}, [id, dispatch, searchParameters]);

	const handleTranscriptionSearch = useCallback((value: string) => {
		// TODO: implement handleTranscriptionSearch logic
		return value;
	}, []);

	const handleShareClick = useCallback(() => {
		// TODO: implement handleShareClick logic
		return;
	}, []);

	const handleExportClick = useCallback(() => {
		// TODO: implement handleExportClick logic
		return;
	}, []);

	if (dataStatus === DataStatus.PENDING) {
		return <Loader isLoading withOverlay />;
	}

	if (dataStatus === DataStatus.REJECTED) {
		return (
			<div className={styles["meeting-details__error"]}>
				{error ?? "An unexpected error occurred."}
			</div>
		);
	}

	if (!meeting) {
		return (
			<div className={styles["meeting-details__not-found"]}>
				Meeting not found.
			</div>
		);
	}

	return (
		<>
			<div className={styles["meeting-details"]}>
				<div className={styles["meeting-details__header"]}>
					<h1 className={styles["meeting-details__title"]}>
						Owner {meeting.ownerId} (
						{formatDate(new Date(meeting.createdAt), "MMM D, YYYY, h:m A")})
					</h1>
					<div className={styles["meeting-details__actions"]}>
						<button
							className={styles["action-button"]}
							onClick={handleShareClick}
						>
							<Icon name="share" />
						</button>
						<Button label="Export" onClick={handleExportClick} />
					</div>
				</div>

				<div className={styles["meeting-details__content"]}>
					<div className={styles["meeting-details__transcription-panel"]}>
						<div className={styles["panel-header"]}>
							<div className={styles["panel-header__text"]}>TRANSCRIPT</div>
							<div className={styles["panel-header__search"]}>
								<SearchInput
									control={control}
									errors={errors}
									hasVisuallyHiddenLabel={true}
									label="Search"
									name="search"
									onSearch={handleTranscriptionSearch}
								/>
							</div>
						</div>
						<div className={styles["transcription-area"]}>
							<p className={styles["transcription-text"]}>
								Good afternoon, everyone. Today, we are here to discuss last
								weeks sales. Today, we are here to discuss last weeks sales.
								Today, we are here to discuss last weeks sales. Good afternoon,
								everyone. Today, we are here to discuss last weeks sales. Today,
								we are here to discuss last weeks sales. Today, we are here to
								discuss last weeks sales. Good afternoon, everyone. Today, we
								are here to discuss last weeks sales. Today, we are here to
								discuss last weeks sales. Today, we are here to discuss last
								weeks sales. Good afternoon, everyone. Today, we are here to
								discuss last weeks sales. Today, we are here to discuss last
								weeks sales. Today, we are here to discuss last weeks sales.
							</p>
						</div>
					</div>

					<div className={styles["meeting-details__right-panel"]}>
						<div>
							<div className={styles["panel-header"]}>
								<div className={styles["panel-header__text"]}>SUMMARY</div>
							</div>
							<div className={styles["summary-area"]}>
								<p className={styles["summary-text"]}>
									Good afternoon, everyone. Today, we are here to discuss last
									weeks sales. Today, we are here to discuss last weeks sales.
									Today, we are here to discuss last weeks sales. Good
									afternoon, everyone. Today, we are here to discuss last weeks
									sales. Today, we are here to discuss last weeks sales. Today,
									we are here to discuss last weeks sales.
								</p>
							</div>
						</div>

						<div>
							<div className={styles["panel-header"]}>
								<div className={styles["panel-header__text"]}>ACTION ITEMS</div>
							</div>

							<ul className={styles["action-items__list"]}>
								<li className={styles["action-items__text"]}>
									<span className={styles["action-item-dot"]}></span>
									Good afternoon, everyone. Today, we are here to discuss last
									weeks sales.
								</li>
								<li className={styles["action-items__text"]}>
									<span className={styles["action-item-dot"]}></span>
									Today, we are here to discuss last weeks sales.
								</li>
								<li className={styles["action-items__text"]}>
									<span className={styles["action-item-dot"]}></span>
									Good afternoon, everyone. Today, we are here to discuss last
									weeks sales.
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className={styles["meeting-details__player"]}>PlayerTrack</div>
			</div>
		</>
	);
};

export { MeetingDetails };
