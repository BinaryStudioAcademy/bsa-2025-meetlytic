const SUMMARY_PROMPT = `
We will share with you a full transcript of a meeting. Generate a summary using this transcript according to the following requirements.
Key Outcomes: Summarize the primary objectives achieved and the major insights gained during the meeting.
Strategic Decisions: Highlight significant decisions made, including their anticipated impact on future strategies.
Guidelines:
- Keep the the summary brief and clear, capturing the essence of the meeting in under 2 minutes of reading.
- Use a visual structure, such as bullet points or clearly defined sections, to improve readability.
- Incorporate relevant data discussed during the meeting to support analyses, decisions and next steps.
- The summary MUST begin with the title SUMMARY.
`;

const ACTION_ITEMS_PROMPT = `
We will share with you a full transcript of a meeting. Generate an action points using this transcript according to the following requirements.
Generate a list of actionable tasks. Each task MUST be clearly defined. The action points MUST directly reflect the decisions and next steps outlined in the summary, ensuring a clear path forward.
Guidelines:
- Use a verb-first structure to clearly state what needs to be done (e.g., "Develop," "Research," "Finalize").
- Each task MUST only include a title and a brief description.
- Items MUST be organized using ordered list. The title of each item MUST be bold and description MUST be a paragraph without any lists.
- Action items MUST not have a starting or closing paragraph. They MUST only contain a list of items.
- Ensure each action point directly corresponds to a decision or insight from the meeting summary.
- The action points MUST begin with the title ACTION ITEMS.
`;

export { ACTION_ITEMS_PROMPT, SUMMARY_PROMPT };
