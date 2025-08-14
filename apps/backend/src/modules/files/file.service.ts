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

	public async findById(id: number): Promise<File | undefined> {
		const fileRow = await this.fileRepository.findById(id);

		return fileRow;
	}

	public async findByUserDetailsId(
		user_details_id: number,
	): Promise<File | undefined> {
		const file = await this.fileRepository.findByUserDetailsId(user_details_id);

		return file;
	}

	public async removeAvatarRecord(user_details_id: number): Promise<boolean> {
		const avatarFile =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		if (!avatarFile) {
			return false;
		}

		await this.userAvatarService.deleteAvatar(avatarFile.key);

		await this.fileRepository.delete(avatarFile.id);

		await this.fileRepository.unsetFileId(user_details_id);

		return true;
	}

	public async replaceAvatarRecord(parameters: {
		key: string;
		url: string;
		user_details_id: number;
	}): Promise<File> {
		const { key, url, user_details_id } = parameters;

		const avatarFile =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		if (avatarFile) {
			await this.userAvatarService.deleteAvatar(avatarFile.key);
			const updated = await this.fileRepository.update(avatarFile.id, {
				key,
				url,
			});

			return updated;
		}

		return await this.fileRepository.create({
			key,
			url,
			user_details_id,
		});
	}
}

export { FileService };
