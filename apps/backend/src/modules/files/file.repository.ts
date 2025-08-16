import { type UserDetailsModel } from "~/modules/users/user-details.model.js";

import { type FileModel } from "./file.model.js";
import { type File } from "./libs/types/types.js";

type Constructor = {
	fileModel: typeof FileModel;
	userDetailsModel: typeof UserDetailsModel;
};

const FILE_TYPE_AVATAR = "avatar";

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
			.patch({ avatarFileId: fileRow.id })
			.where("id", user_details_id);

		return { ...fileRow.toJSON(), type: FILE_TYPE_AVATAR } as File;
	}

	public async delete(id: number): Promise<number> {
		return await this.fileModel.query().deleteById(id);
	}

	public async findById(id: number): Promise<File | undefined> {
		const fileRow = await this.fileModel.query().findById(id);

		return fileRow
			? ({ ...fileRow.toJSON(), type: FILE_TYPE_AVATAR } as File)
			: undefined;
	}

	public async findByUserDetailsId(
		user_details_id: number,
	): Promise<File | undefined> {
		const userDetails = await this.userDetailsModel
			.query()
			.findById(user_details_id)
			.select("avatar_file_id")
			.first();

		if (!userDetails?.avatarFileId) {
			return undefined;
		}

		const fileRow = await this.fileModel
			.query()
			.findById(userDetails.avatarFileId);

		if (!fileRow) {
			return undefined;
		}

		return { ...fileRow.toJSON(), type: FILE_TYPE_AVATAR } as File;
	}

	public async unsetFileId(user_details_id: number): Promise<number> {
		return await this.userDetailsModel
			.query()
			.patch({ avatarFileId: null })
			.where("id", user_details_id);
	}

	public async update(
		id: number,
		parameters: { key: string; url: string },
	): Promise<File> {
		const updatedRow = await this.fileModel
			.query()
			.patchAndFetchById(id, parameters);

		return { ...updatedRow.toJSON(), type: FILE_TYPE_AVATAR } as File;
	}
}

export { FileRepository };
