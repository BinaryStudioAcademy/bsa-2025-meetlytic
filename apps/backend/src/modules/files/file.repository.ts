import { type Transaction } from "objection";

import { type FileModel } from "./file.model.js";
import { type File } from "./libs/types/types.js";

type Constructor = {
	fileModel: typeof FileModel;
};

type CreateFileParameters = {
	contentType: string;
	key: string;
	url: string;
};

type Trx = Transaction | undefined;

type UpdateFileParameters = {
	contentType?: string;
	key?: string;
	url?: string;
};

class FileRepository {
	private fileModel: typeof FileModel;

	public constructor({ fileModel }: Constructor) {
		this.fileModel = fileModel;
	}

	public async create(
		parameters: CreateFileParameters,
		trx?: Trx,
	): Promise<File> {
		const fileRow = await this.fileModel
			.query(trx)
			.insert(parameters)
			.returning("*");

		return fileRow.toJSON() as unknown as File;
	}

	public async delete(id: number, trx?: Trx): Promise<number> {
		return await this.fileModel.query(trx).deleteById(id);
	}

	public async findById(id: number, trx?: Trx): Promise<File | null> {
		const fileRow = await this.fileModel.query(trx).findById(id);

		return fileRow ? (fileRow.toJSON() as unknown as File) : null;
	}

	public async update(
		id: number,
		parameters: UpdateFileParameters,
		trx?: Trx,
	): Promise<File> {
		const fileRow = await this.fileModel
			.query(trx)
			.patchAndFetchById(id, parameters);

		return fileRow.toJSON() as unknown as File;
	}
}

export { type CreateFileParameters, type Trx, FileRepository };
