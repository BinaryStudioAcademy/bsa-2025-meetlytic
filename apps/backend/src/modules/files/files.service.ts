import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

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
};

class FileService implements Service<FileResponseDto> {
	private fileRepository: FileRepository;

	public constructor({ fileRepository }: Constructor) {
		this.fileRepository = fileRepository;
	}

	public async create(payload: FileRequestDto): Promise<FileResponseDto> {
		const entity = FileEntity.initializeNew(payload);
		const created = await this.fileRepository.create(entity);

		return created.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const existing = await this.fileRepository.find(id);

		if (!existing) {
			throw new FileError({
				message: FileErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const ok = await this.fileRepository.delete(id);

		if (!ok) {
			throw new FileError({
				message: FileErrorMessage.DELETE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return ok;
	}

	public async find(id: number): Promise<FileResponseDto> {
		const entity = await this.fileRepository.find(id);

		if (!entity) {
			throw new FileError({
				message: FileErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return entity.toObject();
	}

	public async findAll(
		filter?: Partial<Record<string, unknown>>,
	): Promise<FileGetAllResponseDto> {
		const files = await this.fileRepository.findAll(filter ?? {});

		return { items: files.map((file) => file.toObject()) };
	}

	public async update(
		id: number,
		payload: FileUpdateRequestDto,
	): Promise<FileResponseDto> {
		const existing = await this.fileRepository.find(id);

		if (!existing) {
			throw new FileError({
				message: FileErrorMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const updated = await this.fileRepository.update(id, payload);

		if (!updated) {
			throw new FileError({
				message: FileErrorMessage.UPDATE_FAILED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return updated.toObject();
	}
}

export { FileService };
