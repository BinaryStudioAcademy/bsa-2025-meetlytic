import { type UserDetailsModel } from "~/modules/users/user-details.model.js";

import { type FileModel } from "./file.model.js";
import { type File } from "./libs/types/types.js";

type Constructor = {
	fileModel: typeof FileModel;
	userDetailsModel: typeof UserDetailsModel;
};

class FileRepository {
	private fileModel: typeof FileModel;
	private userDetailsModel: typeof UserDetailsModel;

	public constructor({ fileModel, userDetailsModel }: Constructor) {
		this.fileModel = fileModel;
		this.userDetailsModel = userDetailsModel;
	}

	public async create(parameters: {
		key: string;
		url: string;
		user_details_id: number;
	}): Promise<File> {
		const { key, url, user_details_id } = parameters;

		const fileRow = await this.fileModel
			.query()
			.insert({ key, url })
			.returning("*");

		await this.userDetailsModel
			.query()
			.patch({ fileId: fileRow.id })
			.where("id", user_details_id);

		return fileRow as unknown as File;
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

	public async unsetFileId(user_details_id: number): Promise<number> {
		return await this.userDetailsModel
			.query()
			.patch({ fileId: null })
			.where("id", user_details_id);
	}
}

export { FileRepository };
