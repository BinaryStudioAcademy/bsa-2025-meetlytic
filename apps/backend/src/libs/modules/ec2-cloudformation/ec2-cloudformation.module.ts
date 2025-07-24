import {
	CloudFormationClient,
	CreateStackCommand,
	DeleteStackCommand,
	DescribeStacksCommand,
	waitUntilStackCreateComplete,
	waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";

import { type Logger } from "../logger/logger.js";
import {
	Capability,
	OutputKey,
	ParameterKey,
	StackPrefix,
} from "./libs/enums/enums.js";

type Constructor = {
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	logger: Logger;
	region: string;
	templateBody: string;
};

type CreateEC2Parameters = {
	imageId: string;
	meetingId: string;
};

class CloudFormationEC2 {
	private client: CloudFormationClient;
	private logger: Logger;
	private templateBody: string;

	constructor({ credentials, logger, region, templateBody }: Constructor) {
		this.templateBody = templateBody;
		this.logger = logger;

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
			throw new Error("Failed to get InstanceId from CloudFormation output");
		}

		return instanceId;
	}
	private getStackName(meetingId: string): string {
		return `${StackPrefix.MEETLYTIC}-${meetingId}`;
	}

	async create({ imageId, meetingId }: CreateEC2Parameters): Promise<string> {
		const stackName = this.getStackName(meetingId);

		this.logger.info(`Creating stack: ${stackName}`);

		const command = new CreateStackCommand({
			Capabilities: [Capability.NAMED_IAM],
			Parameters: [
				{ ParameterKey: ParameterKey.IMAGE_ID, ParameterValue: imageId },
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

	async delete(meetingId: string): Promise<void> {
		const stackName = this.getStackName(meetingId);
		this.logger.info(`Deleting stack: ${stackName}`);

		const command = new DeleteStackCommand({ StackName: stackName });
		await this.client.send(command);

		await waitUntilStackDeleteComplete(
			{ client: this.client, maxWaitTime: 300 },
			{ StackName: stackName },
		);

		this.logger.info(`Stack ${stackName} deleted`);
	}
	test() {
		this.logger.info("test CloudFormation");
	}
}

export { CloudFormationEC2 };
