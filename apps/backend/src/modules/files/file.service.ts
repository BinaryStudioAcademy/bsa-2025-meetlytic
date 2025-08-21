import { type UserDetailsModel } from "~/modules/users/user-details.model.js";

import {
	type CreateFileParameters,
	type FileRepository,
} from "./file.repository.js";
import { type File } from "./libs/types/types.js";

type Constructor = {
	fileRepository: FileRepository;
	userDetailsModel: typeof UserDetailsModel;
};

class FileService {
	private fileRepository: FileRepository;
	private userDetailsModel: typeof UserDetailsModel;

	public constructor({ fileRepository, userDetailsModel }: Constructor) {
		this.fileRepository = fileRepository;
		this.userDetailsModel = userDetailsModel;
	}

	private async getAvatarFileId(userDetailsId: number): Promise<null | number> {
		const userDetails = await this.userDetailsModel
			.query()
			.findById(userDetailsId)
			.select("avatarFileId")
			.first();

		return userDetails?.avatarFileId ?? null;
	}

	public async findAvatarByUserDetailsId(
		userDetailsId: number,
	): Promise<File | null> {
		const fileId = await this.getAvatarFileId(userDetailsId);

		return fileId ? await this.fileRepository.findById(fileId) : null;
	}

	public async findById(id: number): Promise<File | null> {
		return await this.fileRepository.findById(id);
	}

	public async getAvatarKeyForDeletion(
		userDetailsId: number,
	): Promise<null | string> {
		const file = await this.findAvatarByUserDetailsId(userDetailsId);

		return file?.key ?? null;
	}

	public async removeAvatarRecord(userDetailsId: number): Promise<boolean> {
		const fileId = await this.getAvatarFileId(userDetailsId);

		if (!fileId) {
			return false;
		}

		await this.fileRepository.delete(fileId);
		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: null })
			.where("id", userDetailsId);

		return true;
	}

	public async replaceAvatarRecord(
		parameters: CreateFileParameters & { userDetailsId: number },
	): Promise<File> {
		const { userDetailsId, ...fileData } = parameters;

		const userDetails = await this.userDetailsModel
			.query()
			.findById(userDetailsId)
			.select("avatarFileId")
			.first();

		if (userDetails?.avatarFileId) {
			return await this.fileRepository.update(
				userDetails.avatarFileId,
				fileData,
			);
		}

		const avatarFile = await this.fileRepository.create(fileData);
		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: avatarFile.id })
			.where("id", userDetailsId);

		return avatarFile;
	}
}

export { FileService };
