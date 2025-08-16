import {
	Button,
	Icon,
	Loader,
	Markdown,
	Navigate,
	PlayerTrack,
	SearchInput,
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
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useParams,
	useSearchParams,
} from "~/libs/hooks/hooks.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { rehypeSanitize, remarkGfm } from "~/libs/plugins/plugins.js";
import { DEFAULT_SEARCH_VALUE } from "~/modules/meeting-details/libs/default-values/meeting-details.default-values.js";
import {
	actions as meetingDetailsActions,
	meetingDetailsApi,
	sanitizeDefaultSchema,
	searchInputValidationSchema,
} from "~/modules/meeting-details/meeting-details.js";

import styles from "./styles.module.css";

const MeetingDetails: React.FC = () => {
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();
	const [searchParameters] = useSearchParams();

	const { dataStatus, meeting, transcription } = useAppSelector(
		(state) => state.meetingDetails,
	);
	const { user } = useAppSelector((state) => state.auth);

	const { control, errors } = useAppForm({
		defaultValues: DEFAULT_SEARCH_VALUE,
		validationSchema: searchInputValidationSchema,
	});

	useEffect(() => {
		const sharedToken = searchParameters.get("token");
		void dispatch(
			meetingDetailsActions.getMeetingDetailsById({
				id: Number(id),
				sharedToken: sharedToken ?? undefined,
			}),
		);
	}, [id, dispatch, searchParameters]);

	const handleTranscriptionSearch = useCallback((value: string) => {
		// TODO: implement handleTranscriptionSearch logic
		return value;
	}, []);

	const handleShareClick = useCallback(() => {
		if (!meeting || !meeting.id) {
			notification.error(NotificationMessage.MEETING_DATA_IS_NOT_AVAILABLE);

			return;
		}

		const shareMeeting = async (): Promise<void> => {
			try {
				const { publicUrl } = await meetingDetailsApi.getPublicShareUrl(
					meeting.id,
				);
				const host = import.meta.env["VITE_APP_HOST"] as string;
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
						<Button label="Export" />
					</div>
				</div>

				<div className={styles["meeting-details__content"]}>
					<div className={styles["meeting-details__transcription-panel"]}>
						<div className={styles["panel-header"]}>
							<h3 className={styles["panel-header__text"]}>TRANSCRIPT</h3>
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
							<p className={styles["transcription-text"]}>{transcription}</p>
						</div>
					</div>

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
