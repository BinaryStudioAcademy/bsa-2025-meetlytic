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

	public findById(id: number): Promise<File | null> {
		return this.fileRepository.findById(id);
	}

	public async findByUserDetailsId(
		userDetailsId: number,
	): Promise<File | null> {
		const file = await this.fileRepository.findByUserDetailsId(userDetailsId);

		return file;
	}

	public async getAvatarKeyForDeletion(
		userDetailsId: number,
	): Promise<null | string> {
		const avatarFile =
			await this.fileRepository.findByUserDetailsId(userDetailsId);

		return avatarFile?.key || null;
	}

	public async removeAvatarRecord(userDetailsId: number): Promise<boolean> {
		const avatarFile =
			await this.fileRepository.findByUserDetailsId(userDetailsId);

		if (!avatarFile) {
			return false;
		}

		await this.fileRepository.delete(avatarFile.id);
		await this.fileRepository.unsetFileId(userDetailsId);

		return true;
	}

	public async replaceAvatarRecord(parameters: {
		contentType: string;
		key: string;
		url: string;
		userDetailsId: number;
	}): Promise<File> {
		const { contentType, key, url, userDetailsId } = parameters;

		const avatarFile =
			await this.fileRepository.findByUserDetailsId(userDetailsId);

		if (avatarFile) {
			const updated = await this.fileRepository.update(avatarFile.id, {
				contentType,
				key,
				url,
			});

			return updated;
		}

		return await this.fileRepository.create({
			contentType,
			key,
			url,
			userDetailsId,
		});
	}
}

export { FileService };
