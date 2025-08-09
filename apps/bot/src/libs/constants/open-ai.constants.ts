const SUMMARY_PROMPT = `
We will share with you a full transcript of a meeting. Generate a summary using this transcript according to the following requirements.
Key Outcomes: Summarize the primary objectives achieved and the major insights gained during the meeting.
Strategic Decisions: Highlight significant decisions made, including their anticipated impact on future strategies.
Guidelines:
- Keep the the summary brief and clear, capturing the essence of the meeting in under 2 minutes of reading.
- Use a visual structure, such as bullet points or clearly defined sections, to improve readability.
- Incorporate relevant data discussed during the meeting to support analyses, decisions and next steps.
`;

const ACTION_POINTS_PROMPT = `
We will share with you a full transcript of a meeting. Generate an action points using this transcript according to the following requirements.
Generate a list of actionable tasks. Each task should be clearly defined, assigned to a specific person, and have a concrete deadline. The action points should directly reflect the decisions and next steps outlined in the summary, ensuring a clear path forward.
Guidelines:
- Use a verb-first structure to clearly state what needs to be done (e.g., "Develop," "Research," "Finalize").
- Assign each task to a single individual to ensure accountability.
- Specify a realistic and clear deadline for each action item.
- Ensure each action point directly corresponds to a decision or insight from the meeting summary.
`;

export { ACTION_POINTS_PROMPT, SUMMARY_PROMPT };
