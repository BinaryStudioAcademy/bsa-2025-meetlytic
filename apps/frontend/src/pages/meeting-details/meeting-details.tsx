import {
	Button,
	Icon,
	Loader,
	Navigate,
	PlayerTrack,
	SearchInput,
} from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
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
		if (!meeting || !meeting.id) {
			// TODO:
			// console.error("No meeting ID to share.");

			return;
		}

		const shareMeeting = async (): Promise<void> => {
			try {
				const { publicUrl } = await meetingApi.getPublicShareUrl(meeting.id);
				void navigator.clipboard.writeText(publicUrl);
				alert("Public link copied to clipboard!");
			} catch (error) {
				// TODO:
				// console.error("Failed to generate share link:", error);
				alert("Failed to generate share link.");

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
		return <Loader isLoading withOverlay />;
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
								;
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
				<div className={styles["meeting-details__player"]}>
					<PlayerTrack audioUrl="https://audio-samples.github.io/samples/mp3/wavenet_unconditional/voxceleb2/sample-5.mp3" />
				</div>
			</div>
		</>
	);
};

export { MeetingDetails };
