import { type FileRepository } from "./file.repository.js";
import { type File } from "./libs/types/types.js";

type Constructor = {
	fileRepository: FileRepository;
};

class FileService {
	private fileRepository: FileRepository;

	public constructor({ fileRepository }: Constructor) {
		this.fileRepository = fileRepository;
	}

	public findById(id: number): Promise<File | undefined> {
		return this.fileRepository.findById(id);
	}

	public async findByUserDetailsId(
		user_details_id: number,
	): Promise<File | undefined> {
		const file = await this.fileRepository.findByUserDetailsId(user_details_id);

		return file;
	}

	public async getAvatarKeyForDeletion(
		user_details_id: number,
	): Promise<null | string> {
		const avatarFile =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		return avatarFile?.key || null;
	}

	public async removeAvatarRecord(user_details_id: number): Promise<boolean> {
		const avatarFile =
			await this.fileRepository.findByUserDetailsId(user_details_id);

		if (!avatarFile) {
			return false;
		}

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
