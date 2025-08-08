import {
	MILLISECONDS_IN_SECOND,
	PERCENT_MULTIPLIER,
	START_TIME,
} from "@meetlytic/shared";

import { AudioEvent, KeyboardKey } from "~/libs/enums/enums.js";
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

		audio.addEventListener(AudioEvent.TIME_UPDATE, handleTimeUpdate);
		audio.addEventListener(AudioEvent.LOADEDMETADATA, handleLoadedMetadata);
		audio.addEventListener(AudioEvent.ENDED, handleEnded);

		return (): void => {
			audio.removeEventListener(AudioEvent.TIME_UPDATE, handleTimeUpdate);
			audio.removeEventListener(
				AudioEvent.LOADEDMETADATA,
				handleLoadedMetadata,
			);
			audio.removeEventListener(AudioEvent.ENDED, handleEnded);
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
			<button className={styles["button"]} onClick={handleTogglePlayback}>
				<Icon className={styles["icon"]} name={isPlaying ? "play" : "pause"} />
			</button>
			<button
				className={styles["progress"]}
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
