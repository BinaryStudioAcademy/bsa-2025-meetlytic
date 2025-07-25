import {
	CloudFormationClient,
	CreateStackCommand,
	DeleteStackCommand,
	DescribeStacksCommand,
	waitUntilStackCreateComplete,
	waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";

import { type MeetingService } from "~/modules/meetings/meeting.service.js";

import { type Logger } from "../logger/logger.js";
import {
	Capability,
	ExceptionMessage,
	OutputKey,
	ParameterKey,
	StackPrefix,
} from "./libs/enums/enums.js";

type Constructor = {
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	imageId: string;
	logger: Logger;
	meetingService: MeetingService;
	region: string;
	templateBody: string;
};

class CloudFormation {
	private client: CloudFormationClient;
	private imageId: string;
	private logger: Logger;
	private meetingService: MeetingService;
	private templateBody: string;

	constructor({
		credentials,
		imageId,
		logger,
		region,
		templateBody,
	}: Constructor) {
		this.templateBody = templateBody;
		this.imageId = imageId;
		this.logger = logger;
		this.meetingService = meetingService;
		this.client = new CloudFormationClient({
			credentials,
			region,
		});
	}

	private async getInstanceIdFromStack(stackName: string): Promise<string> {
		const describeCommand = new DescribeStacksCommand({ StackName: stackName });
		const { Stacks } = await this.client.send(describeCommand);
		const stack = Stacks?.find((stack) => stack.StackName === stackName);
		const instanceId = stack?.Outputs?.find(
			(output) => output.OutputKey === OutputKey.INSTANCE_ID,
		)?.OutputValue;

		if (!instanceId) {
			throw new Error(ExceptionMessage.FAILED_TO_GET_INSTANCE);
		}

		return instanceId;
	}
	private getStackName(meetingId: number): string {
		return `${StackPrefix.MEETLYTIC}-${String(meetingId)}`;
	}

	async create(meetingId: number): Promise<string> {
		const stackName = this.getStackName(meetingId);

		this.logger.info(`Creating stack: ${stackName}`);

		const command = new CreateStackCommand({
			Capabilities: [Capability.NAMED_IAM],
			Parameters: [
				{ ParameterKey: ParameterKey.IMAGE_ID, ParameterValue: this.imageId },
			],
			StackName: stackName,
			TemplateBody: this.templateBody,
		});

		await this.client.send(command);

		await waitUntilStackCreateComplete(
			{ client: this.client, maxWaitTime: 300 },
			{ StackName: stackName },
		);
		const instanceId = await this.getInstanceIdFromStack(stackName);
		this.logger.info(
			`Stack ${stackName} created with InstanceId: ${instanceId}`,
		);

		return instanceId;
	}

	async delete(meetingId: number): Promise<void> {
		const stackName = this.getStackName(meetingId);
		this.logger.info(`Deleting stack: ${stackName}`);

		const command = new DeleteStackCommand({ StackName: stackName });
		await this.client.send(command);

		await waitUntilStackDeleteComplete(
			{ client: this.client, maxWaitTime: 300 },
			{ StackName: stackName },
		);

		await this.meetingService.update(meetingId, { instanceId: null });

		this.logger.info(`Stack ${stackName} deleted`);
	}
}

export { CloudFormation };
