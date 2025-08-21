import { DELETE_SUCCESS_THRESHOLD } from "~/libs/constants/constants.js";
import { type Repository } from "~/libs/types/types.js";

import { type FileModel } from "./file.model.js";
import { FileEntity } from "./files.entity.js";

class FileRepository implements Repository<FileEntity> {
	private fileModel: typeof FileModel;

	public constructor(fileModel: typeof FileModel) {
		this.fileModel = fileModel;
	}

	public async create(entity: FileEntity): Promise<FileEntity> {
		const payload = entity.toNewObject();
		const file = await this.fileModel
			.query()
			.insert(payload)
			.returning("*")
			.execute();

		return FileEntity.initialize(file);
	}

	public async delete(id: number): Promise<boolean> {
		const deleted = await this.fileModel.query().deleteById(id).execute();

		return deleted > DELETE_SUCCESS_THRESHOLD;
	}

	public async find(id: number): Promise<FileEntity | null> {
		const row = await this.fileModel.query().findById(id);

		return row ? FileEntity.initialize(row) : null;
	}

	public async findAll(
		query: Partial<Record<string, unknown>> = {},
	): Promise<FileEntity[]> {
		const rows = await this.fileModel.query().where(query).execute();

		return rows.map((row) => FileEntity.initialize(row));
	}

	public async update(
		id: number,
		payload: Partial<Pick<FileModel, "contentType" | "key" | "url">>,
	): Promise<FileEntity | null> {
		const row = await this.fileModel.query().patchAndFetchById(id, payload);

		return FileEntity.initialize(row);
	}
}

export { FileRepository };
