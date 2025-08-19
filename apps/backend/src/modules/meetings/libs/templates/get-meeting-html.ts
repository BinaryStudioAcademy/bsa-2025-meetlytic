function getMeetingHtml(meetingId: string): string {
	return `
<!DOCTYPEhtml>
<html>
<head>
<metacharset="utf-8"/>
<title>MeetingPDF</title>
<style>
body{
font-family:Arial,sans-serif;
padding:40px;
}
.text{
font-size:16px;
}
</style>
</head>
<body>
<divclass="text">MeetingID:${meetingId}</divclass=>
</body>
</html>
`;
}

export { getMeetingHtml };
