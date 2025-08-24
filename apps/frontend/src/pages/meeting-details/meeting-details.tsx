import {
	Button,
	Icon,
	Loader,
	Markdown,
	MeetingPdf,
	Navigate,
	PDFDownloadLink,
	PlayerTrack,
	TranscriptionPanel,
} from "~/libs/components/components.js";
import {
	AppRoute,
	DataStatus,
	MeetingErrorMessage,
	MeetingStatus,
	NotificationMessage,
	SocketEvent,
} from "~/libs/enums/enums.js";
import { formatDate, shareMeetingPublicUrl } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useMeetingSocket,
	useParams,
	useSearchParams,
	useState,
} from "~/libs/hooks/hooks.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { rehypeSanitize, remarkGfm } from "~/libs/plugins/plugins.js";
import { type MeetingPdfProperties } from "~/libs/types/types.js";
import {
	actions as meetingDetailsActions,
	type MeetingSummaryActionItemsResponseDto,
	sanitizeDefaultSchema,
} from "~/modules/meeting-details/meeting-details.js";
import { actions as meetingActions } from "~/modules/meeting/meeting.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

import styles from "./styles.module.css";

const MeetingDetails: React.FC = () => {
	const [isStopRecordingInProgress, setIsStopRecordingInProgress] =
		useState<boolean>(false);
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();
	const [searchParameters] = useSearchParams();

	useEffect((): (() => void) => {
		return () => {
			dispatch(meetingDetailsActions.clearMeetingDetails());
			dispatch(transcriptionActions.clearTranscription());
		};
	}, [dispatch, id]);

	const { dataStatus, meeting } = useAppSelector(
		(state) => state.meetingDetails,
	);
	const { user } = useAppSelector((state) => state.auth);

	const handleStopRecording = useCallback(() => {
		void dispatch(meetingActions.stopRecording({ id: id as string }));
		setIsStopRecordingInProgress(true);
	}, [dispatch, id]);

	const handleSummaryActionItemsUpdate = useCallback(() => {
		const sharedToken = searchParameters.get("token");

		void dispatch(
			meetingDetailsActions.getMeetingDetailsById({
				id: Number(id),
				sharedToken,
			}),
		);
	}, [dispatch, id, searchParameters]);

	useMeetingSocket<MeetingSummaryActionItemsResponseDto>({
		callback: handleSummaryActionItemsUpdate,
		event: SocketEvent.UPDATE_MEETING_DETAILS,
	});

	useEffect(handleSummaryActionItemsUpdate, [handleSummaryActionItemsUpdate]);

	const handleShareClick = useCallback(() => {
		if (!meeting?.id) {
			notification.error(NotificationMessage.MEETING_DATA_IS_NOT_AVAILABLE);

			return;
		}

		void shareMeetingPublicUrl(meeting.id);
	}, [meeting]);

	const { transcriptions } = useAppSelector((state) => state.transcription);

	if (!id || dataStatus === DataStatus.REJECTED) {
		return <Navigate replace to={AppRoute.NOT_FOUND} />;
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

	const transcription = transcriptions.items
		.map((item) => `• ${item.chunkText}`)
		.join("\n");

	const meetingPdfProperties: MeetingPdfProperties = {
		actionItems: meeting.actionItems ?? "",
		createdAt: meeting.createdAt,
		id: meeting.id,
		summary: meeting.summary ?? "",
		transcription,
	};

	return (
		<>
			<div className={styles["meeting-details"]}>
				<div className={styles["meeting-details__header"]}>
					<h1 className={styles["meeting-details__title"]}>
						Meeting #{meeting.id} |{" "}
						{formatDate(new Date(meeting.createdAt), "D MMMM hA")}
					</h1>
					<div className={styles["meeting-details__actions"]}>
						{user && (
							<button
								className={styles["action-button"]}
								onClick={handleShareClick}
							>
								<Icon className={styles["action-button__share"]} name="share" />
								<span className="visually-hidden">Share meeting</span>
							</button>
						)}
						{meeting.status === MeetingStatus.STARTED && user && (
							<Button
								isDisabled={isStopRecordingInProgress}
								label={
									isStopRecordingInProgress
										? "Stopping recording..."
										: "Stop Recording"
								}
								onClick={handleStopRecording}
							/>
						)}

						<PDFDownloadLink
							document={<MeetingPdf {...meetingPdfProperties} />}
							fileName={`meeting-${meeting.id.toString()}.pdf`}
						>
							{({ loading }) => (
								<Button label={loading ? "Generating PDF..." : "Export"} />
							)}
						</PDFDownloadLink>
					</div>
				</div>

				<div className={styles["meeting-details__content"]}>
					<TranscriptionPanel />

					<div className={styles["meeting-details__right-panel"]}>
						<div>
							<div className={styles["panel-header"]}>
								<h3 className={styles["panel-header__text"]}>SUMMARY</h3>
							</div>
							<div className={styles["summary-area"]}>
								<div className={styles["summary-text"]}>
									<Markdown
										rehypePlugins={[
											[rehypeSanitize, { schema: sanitizeDefaultSchema }],
										]}
										remarkPlugins={[remarkGfm]}
									>
										{meeting.summary ||
											MeetingErrorMessage.MEETING_SUMMARY_NOT_AVAILABLE}
									</Markdown>
								</div>
							</div>
						</div>

						<div>
							<div className={styles["panel-header"]}>
								<h3 className={styles["panel-header__text"]}>ACTION ITEMS</h3>
							</div>
							<div className={styles["action-items-area"]}>
								<div className={styles["action-items-text"]}>
									<Markdown
										rehypePlugins={[
											[rehypeSanitize, { schema: sanitizeDefaultSchema }],
										]}
										remarkPlugins={[remarkGfm]}
									>
										{meeting.actionItems ||
											MeetingErrorMessage.MEETING_ACTION_ITEMS_NOT_AVAILABLE}
									</Markdown>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles["meeting-details__player"]}>
					<PlayerTrack audioUrl={meeting.audioFile?.url} />
				</div>
			</div>
		</>
	);
};

export { MeetingDetails };
