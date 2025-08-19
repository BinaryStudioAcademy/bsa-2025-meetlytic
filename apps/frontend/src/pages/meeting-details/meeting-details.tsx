import {
	Button,
	Icon,
	Loader,
	Markdown,
	Navigate,
	PlayerTrack,
	TranscriptionPanel,
} from "~/libs/components/components.js";
import {
	AppRoute,
	DataStatus,
	MeetingErrorMessage,
	NotificationMessage,
} from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useParams,
	useSearchParams,
} from "~/libs/hooks/hooks.js";
import { config } from "~/libs/modules/config/config.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { rehypeSanitize, remarkGfm } from "~/libs/plugins/plugins.js";
import {
	actions as meetingDetailsActions,
	meetingDetailsApi,
	sanitizeDefaultSchema,
} from "~/modules/meeting-details/meeting-details.js";

import styles from "./styles.module.css";

const MeetingDetails: React.FC = () => {
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();
	const [searchParameters] = useSearchParams();

	const { dataStatus, meeting } = useAppSelector(
		(state) => state.meetingDetails,
	);
	const { user } = useAppSelector((state) => state.auth);

	useEffect(() => {
		const sharedToken = searchParameters.get("token");
		void dispatch(
			meetingDetailsActions.getMeetingDetailsById({
				id: Number(id),
				sharedToken,
			}),
		);
	}, [id, dispatch, searchParameters]);

	const handleExportClick = useCallback(() => {
		if (!meeting?.id) {
			notification.error(NotificationMessage.MEETING_DATA_IS_NOT_AVAILABLE);

			return;
		}

		const exportPdf = async (): Promise<void> => {
			try {
				const pdfBlob = await meetingDetailsApi.exportMeetingPdf(meeting.id);
				const url = globalThis.URL.createObjectURL(pdfBlob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `meeting-${meeting.id.toString()}.pdf`;
				document.body.append(link);
				link.click();
				link.remove();
				globalThis.URL.revokeObjectURL(url);
				notification.success(NotificationMessage.PDF_EXPORTED_SUCCESSFULLY);
			} catch (error: unknown) {
				notification.error(NotificationMessage.PDF_EXPORT_FAILED);

				throw error;
			}
		};

		void exportPdf();
	}, [meeting]);

	const handleShareClick = useCallback(() => {
		if (!meeting?.id) {
			notification.error(NotificationMessage.MEETING_DATA_IS_NOT_AVAILABLE);

			return;
		}

		const shareMeeting = async (): Promise<void> => {
			try {
				const { publicUrl } = await meetingDetailsApi.getPublicShareUrl(
					meeting.id,
				);
				const host = config.ENV.APP.HOST;
				void navigator.clipboard.writeText(`${host}${publicUrl}`);
				notification.success(NotificationMessage.PUBLIC_LINK_COPIED_SUCCESS);
			} catch (error: unknown) {
				notification.error(NotificationMessage.SHARE_LINK_GENERATION_FAILED);

				throw error;
			}
		};

		void shareMeeting();
	}, [meeting]);

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
							</button>
						)}
						<Button label="Export" onClick={handleExportClick} />
					</div>
				</div>

				<div className={styles["meeting-details__content"]}>
					<TranscriptionPanel
						meetingId={meeting.id}
						meetingStatus={meeting.status}
					/>

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
									<span className={styles["action-item-dot"]} />
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
					<PlayerTrack audioUrl="https://audio-samples.github.io/samples/mp3/wavenet_unconditional/voxceleb2/sample-5.mp3" />
				</div>
			</div>
		</>
	);
};

export { MeetingDetails };
