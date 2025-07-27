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
	OutputKey,
	ParameterKey,
	StackPrefix,
} from "./libs/enums/enums.js";
import { ExceptionMessage } from "~/libs/enums/enums.js";
import { CreateInstance } from "./libs/type/types.js";
import { CloudFormationError } from "~/libs/exceptions/exceptions.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

type Constructor = {
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	imageId: string;
	logger: Logger;
	meetingService: MeetingService;
	region: string;
};

class CloudFormation {
	private client: CloudFormationClient;
	private imageId: string;
	private logger: Logger;
	private meetingService: MeetingService;

	constructor({
		credentials,
		imageId,
		logger,
		meetingService,
		region,
	}: Constructor) {
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
			throw new CloudFormationError({
				message: ExceptionMessage.FAILED_TO_GET_INSTANCE,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			});
		}

		return instanceId;
	}
	private getStackName(meetingId: number): string {
		return `${StackPrefix.MEETLYTIC}-${String(meetingId)}`;
	}

	async create({ id, template }: CreateInstance): Promise<string> {
		const stackName = this.getStackName(id);
		this.logger.info(`Creating stack: ${stackName}`);
		try {
			const command = new CreateStackCommand({
				Capabilities: [Capability.NAMED_IAM],
				Parameters: [
					{ ParameterKey: ParameterKey.IMAGE_ID, ParameterValue: this.imageId },
				],
				StackName: stackName,
				TemplateBody: template,
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
		} catch (error) {
			this.logger.error(`Failed to create stack ${stackName}`, error);
			throw new CloudFormationError({
				message: ExceptionMessage.FAILED_TO_CREATE_STACK,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
				cause: error,
			});
		}
	}

	async delete(meetingId: number): Promise<void> {
		const stackName = this.getStackName(meetingId);
		this.logger.info(`Deleting stack: ${stackName}`);
		try {
			const command = new DeleteStackCommand({ StackName: stackName });
			await this.client.send(command);

			await waitUntilStackDeleteComplete(
				{ client: this.client, maxWaitTime: 300 },
				{ StackName: stackName },
			);

			await this.meetingService.update(meetingId, { instanceId: null });

			this.logger.info(`Stack ${stackName} deleted`);
		} catch (error) {
			this.logger.error(`Failed to delete stack ${stackName}:`, error);

			throw new CloudFormationError({
				cause: error,
				message: ExceptionMessage.FAILED_TO_DELETE_STACK,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			});
		}
	}
}

export { CloudFormation };
