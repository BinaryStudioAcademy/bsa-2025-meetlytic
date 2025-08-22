import React, { memo } from "react";

import { TypingIndicator } from "~/libs/components/components.js";
import { IndicatorVariant } from "~/libs/components/typing-indicator/typing-indicator.js";

type Properties = {
	isTyping: boolean;
	typedText: string;
};

const LiveTranscription: React.FC<Properties> = memo(
	({ isTyping, typedText }: Properties) => {
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
	},
);

LiveTranscription.displayName = "LiveTranscription";

export { LiveTranscription };
