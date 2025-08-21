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

	public async create(parameters: CreateFileParameters): Promise<File> {
		const fileRow = await this.fileModel
			.query()
			.insert(parameters)
			.returning("*");

		return fileRow.toJSON() as unknown as File;
	}

	public async delete(id: number): Promise<number> {
		return await this.fileModel.query().deleteById(id);
	}

	public async findById(id: number): Promise<File | null> {
		const fileRow = await this.fileModel.query().findById(id);

		return fileRow ? (fileRow.toJSON() as unknown as File) : null;
	}

	public async update(
		id: number,
		parameters: UpdateFileParameters,
	): Promise<File> {
		const fileRow = await this.fileModel
			.query()
			.patchAndFetchById(id, parameters);

		return fileRow.toJSON() as unknown as File;
	}
}

export { type CreateFileParameters, FileRepository };
