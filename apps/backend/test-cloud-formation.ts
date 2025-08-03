import { cloudFormation } from "~/libs/modules/cloud-formation/cloud-formation.js";
import template from "~/libs/modules/cloud-formation/libs/templates/ec2-instance-template.json" with { type: "json" };

const testMeetingId = "85365878645";

const testCreateDeleteStack = async () => {
	try {
		console.log("Creating stack...");
		const instanceId = await cloudFormation.create({
			id: testMeetingId,
			template: JSON.stringify(template),
			zoomPassword: "AGjtXQFE5bI5zvpJbLbLnl2IkWglzD.1",
		});
		console.log(`Stack created. EC2 Instance ID: ${instanceId}`);

		console.log("Deleting stack...");
		//await cloudFormation.delete(testMeetingId);
		console.log("Stack deleted.");
	} catch (error) {
		console.error("Error during test:", error);
	}
};

testCreateDeleteStack();
