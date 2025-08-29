import { TYPING_SPEED } from "~/libs/constants/type-speed.constant.js";
import {
	useAppDispatch,
	useCallback,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import {
	type MeetingTranscriptionResponseDto,
	actions as transcriptionActions,
} from "~/modules/transcription/transcription.js";

type UseTypingQueueReturn = {
	handleAddChunk: (chunk: MeetingTranscriptionResponseDto) => void;
	isTyping: boolean;
	typedText: string;
};

const useTypingQueue = (typingSpeed = TYPING_SPEED): UseTypingQueueReturn => {
	const dispatch = useAppDispatch();
	const [typedText, setTypedText] = useState<string>("");
	const queueReference = useRef<MeetingTranscriptionResponseDto[]>([]);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const isTypingReference = useRef<boolean>(false);

	const processQueue = useCallback(() => {
		if (isTypingReference.current) {
			return;
		}

		const next = queueReference.current.shift();

		if (!next || !next.chunkText) {
			return;
		}

		const text = next.chunkText;
		isTypingReference.current = true;
		setIsTyping(true);
		setTypedText("");
		let index = 0;

		setTypedText(` ${text.charAt(index)}`);

		const typeNextChar = (): void => {
			setTypedText((previous) => {
				return previous + text.charAt(index);
			});
			index++;

			if (index >= text.length) {
				isTypingReference.current = false;
				setIsTyping(false);
				processQueue();

				return;
			}

			setTimeout(typeNextChar, typingSpeed);
		};

		typeNextChar();
	}, [typingSpeed]);

	const handleAddChunk = useCallback(
		(chunk: MeetingTranscriptionResponseDto) => {
			if (!chunk.chunkText) {
				return;
			}

			if (document.hidden) {
				dispatch(transcriptionActions.addTranscription(chunk));

				return;
			}

			dispatch(transcriptionActions.addTranscription(chunk));
			queueReference.current.push(chunk);
			processQueue();
		},
		[processQueue],
	);

	return { handleAddChunk, isTyping, typedText };
};

export { useTypingQueue };
