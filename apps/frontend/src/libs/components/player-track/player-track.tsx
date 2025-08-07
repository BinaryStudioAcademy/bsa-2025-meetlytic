import { KeyboardKey } from "~/libs/enums/enums.js";
import { formatDate, getValidClassNames } from "~/libs/helpers/helpers.js";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";

import { Icon } from "../components.js";
import styles from "./styles.module.css";

type Properties = {
	audioUrl: string;
};

const PlayerTrack: React.FC<Properties> = ({ audioUrl }: Properties) => {
	const MILLISECONDS_IN_SECOND = 1000;
	const PERCENT_MULTIPLIER = 100;
	const START_TIME = 0;

	const audioReference = useRef<HTMLAudioElement>(null);
	const progressReference = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const audio = audioReference.current;

		if (!audio) {
			return;
		}

		const handleTimeUpdate = (): void => {
			setCurrentTime(audio.currentTime);
		};

		const handleLoadedMetadata = (): void => {
			setDuration(audio.duration);
		};

		const handleEnded = (): void => {
			setIsPlaying(false);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);

		return (): void => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(START_TIME);
	const [duration, setDuration] = useState(START_TIME);

	const togglePlayback = useCallback(async (): Promise<void> => {
		if (!audioReference.current) {
			return;
		}

		if (isPlaying) {
			audioReference.current.pause();
		} else {
			await audioReference.current.play();
		}

		setIsPlaying(!isPlaying);
	}, [isPlaying]);

	const handleTogglePlayback = useCallback((): void => {
		void togglePlayback();
	}, [togglePlayback]);

	const handleSeek = useCallback(
		(event: React.KeyboardEvent | React.MouseEvent): void => {
			if (!audioReference.current || !progressReference.current) {
				return;
			}

			if ("clientX" in event) {
				const rect = progressReference.current.getBoundingClientRect();
				const clickX = event.clientX - rect.left;
				const newTime = (clickX / rect.width) * duration;

				audioReference.current.currentTime = newTime;
				setCurrentTime(newTime);
			}
		},
		[duration],
	);

	const handleInteraction = useCallback(
		(event: React.KeyboardEvent | React.MouseEvent): void => {
			if ("clientX" in event) {
				handleSeek(event);

				return;
			}

			if (
				"key" in event &&
				(event.key === KeyboardKey.ENTER || event.key === KeyboardKey.SPACE)
			) {
				handleSeek(event);
			}
		},
		[handleSeek],
	);

	const progressWidth = `${String((currentTime / duration) * PERCENT_MULTIPLIER)}%`;

	return (
		<div className={styles["root"]}>
			<button
				className={getValidClassNames(styles["button"], "")}
				onClick={handleTogglePlayback}
			>
				{isPlaying ? (
					<Icon className={styles["icon"]} name="play" />
				) : (
					<Icon className={styles["icon"]} name="pause" />
				)}
			</button>
			<button
				className={getValidClassNames(styles["progress"], "")}
				onClick={handleInteraction}
				onKeyDown={handleInteraction}
				ref={progressReference}
			>
				<div
					className={getValidClassNames(
						styles["progress__fill"],
						isPlaying && styles["progress__fill_active"],
					)}
					style={{ width: progressWidth }}
				/>
			</button>
			<div className={styles["time"]}>
				{formatDate(new Date(currentTime * MILLISECONDS_IN_SECOND), "mm:ss")} /{" "}
				{formatDate(new Date(duration * MILLISECONDS_IN_SECOND), "mm:ss")}
			</div>
			{/* We will not have captions file for this */}
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<audio preload="metadata" ref={audioReference} src={audioUrl} />
		</div>
	);
};

export { PlayerTrack };
