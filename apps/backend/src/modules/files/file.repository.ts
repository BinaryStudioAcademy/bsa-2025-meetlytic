import { type FileModel } from "./file.model.js";
import { type File } from "./libs/types/types.js";

class FileRepository {
	private fileModel: typeof FileModel;

	public constructor(fileModel: typeof FileModel) {
		this.fileModel = fileModel;
	}

	public async create(payload: {
		key: string;
		url: string;
		user_details_id: number;
	}): Promise<File> {
		const { key, url, user_details_id } = payload;
		const row = await this.fileModel
			.query()
			.insert({ key, url, user_details_id })
			.returning("*");

		return row as unknown as File;
	}

	public async delete(id: number): Promise<number> {
		return await this.fileModel.query().deleteById(id);
	}

	public async findByUserDetailsId(
		user_details_id: number,
	): Promise<File | undefined> {
		const file = await this.fileModel.query().findOne({ user_details_id });

		return file as unknown as File | undefined;
	}
}

export { FileRepository };
