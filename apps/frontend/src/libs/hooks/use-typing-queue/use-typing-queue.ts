import { TYPING_SPEED } from "~/libs/constants/type-speed.constant.js";
import { useCallback, useRef, useState } from "~/libs/hooks/hooks.js";
import { type MeetingTranscriptionResponseDto } from "~/modules/transcription/transcription.js";

type UseTypingQueueReturn = {
	isTyping: boolean;
	onAddChunk: (chunk: MeetingTranscriptionResponseDto) => void;
	typedText: string;
};

const useTypingQueue = (typingSpeed = TYPING_SPEED): UseTypingQueueReturn => {
	const ONE = 1;
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
		let index = 0;

		setTypedText((previous) => {
			return previous + " " + text.charAt(index - ONE);
		});

		const typeNextChar = (): void => {
			setTypedText((previous) => {
				return previous + text.charAt(index);
			});
			index++;

			if (index > text.length) {
				isTypingReference.current = false;
				setIsTyping(false);
				processQueue();

				return;
			}

			setTimeout(typeNextChar, typingSpeed);
		};

		typeNextChar();
	}, [typingSpeed]);

	const onAddChunk = useCallback(
		(chunk: MeetingTranscriptionResponseDto) => {
			if (!chunk.chunkText) {
				return;
			}

			queueReference.current.push(chunk);

			processQueue();
		},
		[processQueue],
	);

	return { isTyping, onAddChunk, typedText };
};

export { useTypingQueue };
