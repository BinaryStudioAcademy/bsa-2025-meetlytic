import {
	CloudFormationClient,
	CreateStackCommand,
	DeleteStackCommand,
	DescribeStacksCommand,
	waitUntilStackCreateComplete,
	waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";

import { ExceptionMessage } from "~/libs/enums/enums.js";
import { CloudFormationError } from "~/libs/exceptions/exceptions.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

import { type Logger } from "../logger/logger.js";
import {
	Capability,
	OutputKey,
	ParameterKey,
	StackPrefix,
} from "./libs/enums/enums.js";
import { type CloudFormation, type CreateStack } from "./libs/type/types.js";

type Constructor = {
	botName: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	imageId: string;
	logger: Logger;
	openAIKey: string;
	region: string;
	textGenerationModel: string;
	transcriptionModel: string;
};

class BaseCloudFormation implements CloudFormation {
	private accessKeyId: string;
	private botName: string;
	private client: CloudFormationClient;
	private imageId: string;
	private logger: Logger;
	private openAIKey: string;
	private region: string;
	private secretAccessKey: string;
	private textGenerationModel: string;
	private transcriptionModel: string;

	public constructor({
		botName,
		credentials,
		imageId,
		logger,
		openAIKey,
		region,
		textGenerationModel,
		transcriptionModel,
	}: Constructor) {
		this.imageId = imageId;
		this.logger = logger;
		this.botName = botName;
		this.accessKeyId = credentials.accessKeyId;
		this.secretAccessKey = credentials.secretAccessKey;
		this.region = region;
		this.client = new CloudFormationClient({
			credentials,
			region,
		});
		this.openAIKey = openAIKey;
		this.textGenerationModel = textGenerationModel;
		this.transcriptionModel = transcriptionModel;
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

	public async create({
		id,
		meetingPassword = "",
		template,
	}: CreateStack): Promise<string> {
		const stackName = this.getStackName(id);
		this.logger.info(`Creating stack: ${stackName}`);

		try {
			const command = new CreateStackCommand({
				Capabilities: [Capability.NAMED_IAM],
				Parameters: [
					{
						ParameterKey: ParameterKey.AWS_ACCESS_KEY_ID,
						ParameterValue: this.accessKeyId,
					},
					{
						ParameterKey: ParameterKey.AWS_REGION,
						ParameterValue: this.region,
					},
					{
						ParameterKey: ParameterKey.AWS_SECRET_ACCESS_KEY,
						ParameterValue: this.secretAccessKey,
					},
					{ ParameterKey: ParameterKey.BOT_NAME, ParameterValue: this.botName },
					{ ParameterKey: ParameterKey.IMAGE_ID, ParameterValue: this.imageId },
					{ ParameterKey: ParameterKey.MEETING_ID, ParameterValue: String(id) },
					{
						ParameterKey: ParameterKey.MEETING_PASSWORD,
						ParameterValue: meetingPassword,
					},
					{
						ParameterKey: ParameterKey.OPEN_AI_KEY,
						ParameterValue: this.openAIKey,
					},
					{
						ParameterKey: ParameterKey.TEXT_GENERATION_MODEL,
						ParameterValue: this.textGenerationModel,
					},
					{
						ParameterKey: ParameterKey.TRANSCRIPTION_MODEL,
						ParameterValue: this.transcriptionModel,
					},
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
			if (error instanceof Error) {
				this.logger.error(`Failed to create stack ${stackName}`, {
					message: error.message,
					stack: error.stack,
				});
			} else {
				this.logger.error(`Failed to create stack ${stackName}`, { error });
			}

			throw new CloudFormationError({
				cause: error,
				message: ExceptionMessage.FAILED_TO_CREATE_STACK,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			});
		}
	}

	public async delete(meetingId: number): Promise<void> {
		const stackName = this.getStackName(meetingId);
		this.logger.info(`Deleting stack: ${stackName}`);

		try {
			const command = new DeleteStackCommand({ StackName: stackName });
			await this.client.send(command);

			await waitUntilStackDeleteComplete(
				{ client: this.client, maxWaitTime: 300 },
				{ StackName: stackName },
			);

			this.logger.info(`Stack ${stackName} deleted`);
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`Failed to delete stack ${stackName}:`, {
					message: error.message,
					stack: error.stack,
				});
			} else {
				this.logger.error(`Failed to delete stack ${stackName}:`, { error });
			}

			throw new CloudFormationError({
				cause: error,
				message: ExceptionMessage.FAILED_TO_DELETE_STACK,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			});
		}
	}
}

export { BaseCloudFormation };
