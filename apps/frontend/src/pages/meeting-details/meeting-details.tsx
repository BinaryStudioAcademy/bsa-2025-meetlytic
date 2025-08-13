import {
	Button,
	Icon,
	Loader,
	Navigate,
	PlayerTrack,
	SearchInput,
} from "~/libs/components/components.js";
import { ZERO_LENGTH } from "~/libs/constants/constants.js";
import { DataStatus, MeetingErrorMessage } from "~/libs/enums/enums.js";
import { formatDate, getOffsetHours } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useParams,
	useSearchParams,
} from "~/libs/hooks/hooks.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import {
	actions as meetingActions,
	meetingApi,
} from "~/modules/meeting/meeting.js";

import styles from "./styles.module.css";

const MeetingDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [searchParameters] = useSearchParams();
	const dispatch = useAppDispatch();

	const { selectedMeeting: meeting, selectedMeetingDataStatus: dataStatus } =
		useAppSelector((state) => state.meeting);

	const { control, errors } = useAppForm({
		defaultValues: {
			search: "",
		},
	});

	useEffect(() => {
		if (!id) {
			return;
		}

		const shareToken = searchParameters.get("token");
		void dispatch(
			meetingActions.getMeetingDetailsById({
				id: Number(id),
				token: shareToken ?? undefined,
			}),
		);
	}, [id, dispatch, searchParameters]);

	const handleTranscriptionSearch = useCallback((value: string) => {
		// TODO: implement handleTranscriptionSearch logic
		return value;
	}, []);

	const handleShareClick = useCallback(() => {
		// TODO: !!! Implement handleShareClick logic. Already implemented logic is just for demonstration use and should be changed.
		if (!meeting || !meeting.id) {
			notification.error("Meeting data is not available for sharing.");

			return;
		}

		const shareMeeting = async (): Promise<void> => {
			try {
				const { publicUrl } = await meetingApi.getPublicShareUrl(meeting.id);
				void navigator.clipboard.writeText(`http://localhost:3000${publicUrl}`);
				notification.success("Public link copied to clipboard!");
			} catch (error: unknown) {
				notification.error("Failed to generate share link.");

				throw error;
			}
		};

		void shareMeeting();
	}, [meeting]);

	const handleExportClick = useCallback(() => {
		// TODO: implement handleExportClick logic
		return;
	}, []);

	if (!id || dataStatus === DataStatus.REJECTED) {
		return <Navigate replace to={"404"} />;
	}

	if (dataStatus === DataStatus.PENDING) {
		return <Loader hasOverlay isLoading />;
	}

	if (!meeting) {
		return (
			<div className={styles["meeting-details__not-found"]}>
				Meeting not found.
			</div>
		);
	}

	const actionItemsArray = meeting.actionItems
		? meeting.actionItems
				.split(".")
				.map((item) => item.trim())
				.filter((item) => item.length > ZERO_LENGTH)
		: [];

	return (
		<>
			<div className={styles["meeting-details"]}>
				<div className={styles["meeting-details__header"]}>
					<h1 className={styles["meeting-details__title"]}>
						Owner {meeting.ownerId}{" "}
						{getOffsetHours(new Date(meeting.createdAt))} |{" "}
						{formatDate(new Date(meeting.createdAt), "D MMMM hA")}
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
									{meeting.summary ||
										MeetingErrorMessage.MEETING_SUMMARY_NOT_AVAILABLE}
								</p>
							</div>
						</div>

						<div>
							<div className={styles["panel-header"]}>
								<div className={styles["panel-header__text"]}>ACTION ITEMS</div>
							</div>
							<ul className={styles["action-items__list"]}>
								{actionItemsArray.length > ZERO_LENGTH ? (
									actionItemsArray.map((item, index) => (
										<li className={styles["action-items__text"]} key={index}>
											<span className={styles["action-item-dot"]}></span>
											{item}
										</li>
									))
								) : (
									<li className={styles["action-items__text"]}>
										{MeetingErrorMessage.MEETING_ACTION_ITEMS_NOT_AVAILABLE}
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
				<div className={styles["meeting-details__player"]}>
					<PlayerTrack audioUrl="https://audio-samples.github.io/samples/mp3/wavenet_unconditional/voxceleb2/sample-5.mp3" />
				</div>
			</div>
		</>
	);
};

export { MeetingDetails };
