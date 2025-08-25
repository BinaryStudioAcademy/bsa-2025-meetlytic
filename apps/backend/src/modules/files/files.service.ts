import { HTTPCode } from "~/libs/modules/http/http.js";
import { type AvatarFileDto, type Service } from "~/libs/types/types.js";
import { type UserDetailsModel } from "~/modules/users/user-details.model.js";

import { FileEntity } from "./files.entity.js";
import { type FileRepository } from "./files.repository.js";
import { FileErrorMessage } from "./libs/enums/enums.js";
import { FileError } from "./libs/exceptions/exceptions.js";
import {
	type FileGetAllResponseDto,
	type FileRequestDto,
	type FileResponseDto,
	type FileUpdateRequestDto,
} from "./libs/types/types.js";

type Constructor = {
	fileRepository: FileRepository;
	userDetailsModel: typeof UserDetailsModel;
};

class FileService implements Service<FileResponseDto> {
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

	public async create(payload: FileRequestDto): Promise<FileResponseDto> {
		const file = FileEntity.initializeNew(payload);
		const newFile = await this.fileRepository.create(file);

		return newFile.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const file = await this.fileRepository.find(id);

		if (!file) {
			throw new FileError({
				message: FileErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const isDeleted = await this.fileRepository.delete(id);

		if (!isDeleted) {
			throw new FileError({
				message: FileErrorMessage.DELETE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return isDeleted;
	}

	public async find(id: number): Promise<FileResponseDto> {
		const file = await this.fileRepository.find(id);

		if (!file) {
			throw new FileError({
				message: FileErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return file.toObject();
	}

	public async findAll(
		filter?: Partial<Record<string, unknown>>,
	): Promise<FileGetAllResponseDto> {
		const files = await this.fileRepository.findAll(filter ?? {});

		return { items: files.map((file) => file.toObject()) };
	}

	public async findAvatarByUserDetailsId(
		userDetailsId: number,
	): Promise<FileResponseDto | null> {
		const fileId = await this.getAvatarFileId(userDetailsId);

		if (!fileId) {
			return null;
		}

		const entity = await this.fileRepository.find(fileId);

		return entity ? entity.toObject() : null;
	}

	public async getAvatarKeyForDeletion(
		userDetailsId: number,
	): Promise<null | string> {
		const dto = await this.findAvatarByUserDetailsId(userDetailsId);

		return dto?.key ?? null;
	}

	public async removeAvatarRecord(userDetailsId: number): Promise<boolean> {
		const fileId = await this.getAvatarFileId(userDetailsId);

		if (!fileId) {
			return false;
		}

		const isDeleted = await this.fileRepository.delete(fileId);
		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: null })
			.where("id", userDetailsId);

		return isDeleted;
	}

	public async replaceAvatarRecord(parameters: {
		contentType: FileRequestDto["contentType"];
		key: AvatarFileDto["key"];
		url: AvatarFileDto["url"];
		userDetailsId: number;
	}): Promise<FileResponseDto> {
		const { userDetailsId, ...fileData } = parameters;

		const existingId = await this.getAvatarFileId(userDetailsId);

		if (existingId) {
			const updated = await this.fileRepository.update(existingId, fileData);

			if (!updated) {
				throw new FileError({
					message: FileErrorMessage.UPDATE_FAILED,
					status: HTTPCode.BAD_REQUEST,
				});
			}

			return updated.toObject();
		}

		const entity = FileEntity.initializeNew(fileData);
		const created = await this.fileRepository.create(entity);

		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: created.toObject().id })
			.where("id", userDetailsId);

		return created.toObject();
	}

	public async update(
		id: number,
		payload: FileUpdateRequestDto,
	): Promise<FileResponseDto> {
		const file = await this.fileRepository.find(id);

		if (!file) {
			throw new FileError({
				message: FileErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const updatedFile = await this.fileRepository.update(id, payload);

		if (!updatedFile) {
			throw new FileError({
				message: FileErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updatedFile.toObject();
	}
}

export { FileService };
