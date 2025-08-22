import { TypingIndicator } from "~/libs/components/components.js";
import { IndicatorVariant } from "~/libs/components/typing-indicator/typing-indicator.js";

type Properties = {
	isTyping: boolean;
	typedText: string;
};

const LiveTranscription: React.FC<Properties> = ({
	isTyping,
	typedText,
}: Properties) => {
	return (
		<>
			{typedText}
			{!isTyping && (
				<>
					<TypingIndicator variant={IndicatorVariant.DOT} />
				</>
			)}
		</>
	);
};

export { LiveTranscription };
