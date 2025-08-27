import { MeetingStatus } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type StatusMeta } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string;
	status: ValueOf<typeof MeetingStatus>;
	titleOverride?: string;
};

const mapStatus = (status: ValueOf<typeof MeetingStatus>): StatusMeta => {
	switch (status) {
		case MeetingStatus.ENDED: {
			return { label: "Ended", title: "Recording finished", tone: "neutral" };
		}

		case MeetingStatus.FAILED: {
			return { label: "Failed", title: "Bot failed to join", tone: "danger" };
		}

		case MeetingStatus.JOINING: {
			return {
				label: "Joining",
				title: "Bot is joining the meeting…",
				tone: "info",
			};
		}

		case MeetingStatus.RECORDING: {
			return {
				label: "Recording",
				title: "Recording in progress",
				tone: "warning",
			};
		}

		case MeetingStatus.STARTED: {
			return {
				label: "Started",
				title: "Bot is in the meeting",
				tone: "success",
			};
		}

		default: {
			return { label: "", title: "", tone: "neutral" };
		}
	}
};

const statusToClassName: Record<ValueOf<typeof MeetingStatus>, string> = {
	[MeetingStatus.ENDED]: styles["meeting-status-badge__indicator--check"] || "",
	[MeetingStatus.FAILED]:
		styles["meeting-status-badge__indicator--cross"] || "",
	[MeetingStatus.JOINING]:
		styles["meeting-status-badge__indicator--spinner"] || "",
	[MeetingStatus.RECORDING]:
		styles["meeting-status-badge__indicator--pulse"] || "",
	[MeetingStatus.STARTED]: "",
};

const MeetingStatusBadge = ({
	className,
	status,
	titleOverride,
}: Properties): React.JSX.Element => {
	const { label, title: defaultTitle, tone } = mapStatus(status);
	const title = titleOverride ?? defaultTitle;
	const indicatorClass = statusToClassName[status];

	return (
		<span
			aria-label={`${label}. ${title}`}
			aria-live="polite"
			className={getValidClassNames(
				styles["meeting-status-badge"],
				styles[`meeting-status-badge--${tone}`],
				className,
			)}
			data-status={status}
			role="status"
			title={title}
		>
			<span
				aria-hidden="true"
				className={getValidClassNames(
					styles["meeting-status-badge__indicator"],
					indicatorClass,
				)}
			/>
			<span className={styles["meeting-status-badge__label"]}>{label}</span>
		</span>
	);
};

export { MeetingStatusBadge };
