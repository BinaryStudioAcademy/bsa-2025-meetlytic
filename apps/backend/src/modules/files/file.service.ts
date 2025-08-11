import { type UserAvatarService } from "~/modules/users/user-avatar.service.js";

import { type FileRepository } from "./file.repository.js";
import { type File } from "./libs/types/types.js";

type Constructor = {
	fileRepository: FileRepository;
	userAvatarService: UserAvatarService;
};

class FileService {
	private fileRepository: FileRepository;
	private userAvatarService: UserAvatarService;

	public constructor({ fileRepository, userAvatarService }: Constructor) {
		this.fileRepository = fileRepository;
		this.userAvatarService = userAvatarService;
	}

	public async findByUserDetailsId(
		user_details_id: number,
	): Promise<File | undefined> {
		const result =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		return result;
	}

	public async removeAvatarRecord(user_details_id: number): Promise<boolean> {
		const existing =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		if (!existing) {
			return false;
		}

		await this.fileRepository.delete(existing.id);

		return true;
	}

	public async replaceAvatarRecord(parameters: {
		key: string;
		url: string;
		user_details_id: number;
	}): Promise<File> {
		const { key, url, user_details_id } = parameters;

		const existing =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		if (existing) {
			await this.userAvatarService.deleteAvatar(existing.key);
			await this.fileRepository.delete(existing.id);
		}

		return await this.fileRepository.create({
			key,
			url,
			user_details_id,
		});
	}
}

export { FileService };
