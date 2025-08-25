import { MeetingStatus } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	className?: string;
	compact?: boolean;
	status: ValueOf<typeof MeetingStatus>;
	titleOverride?: string;
};

const LABEL: Record<ValueOf<typeof MeetingStatus>, string> = {
	[MeetingStatus.ENDED]: "Ended",
	[MeetingStatus.FAILED]: "Failed",
	[MeetingStatus.JOINING]: "Joining",
	[MeetingStatus.RECORDING]: "Recording",
	[MeetingStatus.STARTED]: "Started",
};

const TITLE: Record<ValueOf<typeof MeetingStatus>, string> = {
	[MeetingStatus.ENDED]: "Recording finished",
	[MeetingStatus.FAILED]: "Bot failed to join",
	[MeetingStatus.JOINING]: "Bot is joining the meeting…",
	[MeetingStatus.RECORDING]: "Recording in progress",
	[MeetingStatus.STARTED]: "Bot is in the meeting",
};

type Tone = "danger" | "info" | "neutral" | "success" | "warning";

function toneFromStatus(status: ValueOf<typeof MeetingStatus>): Tone {
	switch (status) {
		case MeetingStatus.ENDED: {
			return "neutral";
		}

		case MeetingStatus.FAILED: {
			return "danger";
		}

		case MeetingStatus.JOINING: {
			return "info";
		}

		case MeetingStatus.RECORDING: {
			return "warning";
		}

		case MeetingStatus.STARTED: {
			return "success";
		}

		default: {
			return "neutral";
		}
	}
}

const MeetingStatusBadge = ({
	className,
	status,
	titleOverride,
}: Properties): React.JSX.Element => {
	const tone = toneFromStatus(status);
	const label = LABEL[status];
	const title = titleOverride ?? TITLE[status];

	return (
		<span
			aria-label={`${label}. ${title}`}
			aria-live="polite"
			className={getValidClassNames(
				styles["msb"],
				styles[`msb--${tone}`],
				className,
			)}
			data-status={status}
			role="status"
			title={title}
		>
			<span
				aria-hidden="true"
				className={getValidClassNames(
					styles["msb__indicator"],
					status === MeetingStatus.JOINING && styles["msb__indicator--spinner"],
					status === MeetingStatus.RECORDING && styles["msb__indicator--pulse"],
					status === MeetingStatus.FAILED && styles["msb__indicator--cross"],
					status === MeetingStatus.ENDED && styles["msb__indicator--check"],
				)}
			/>
			<span className={styles["msb__label"]}>{label}</span>
		</span>
	);
};

export { MeetingStatusBadge };
