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
		contentType: string;
		key: string;
		url: string;
		userDetailsId: number;
	}): Promise<File> {
		const { contentType, key, url, userDetailsId } = parameters;

		const fileRow = await this.fileModel
			.query()
			.insert({ contentType, key, url })
			.returning("*");

		await this.userDetailsModel
			.query()
			.patch({ avatarFileId: fileRow.id })
			.where("id", userDetailsId);

		return { ...fileRow.toJSON(), type: FILE_TYPE_AVATAR } as File;
	}

	public async delete(id: number): Promise<number> {
		return await this.fileModel.query().deleteById(id);
	}

	public async findById(id: number): Promise<File | null> {
		const fileRow = await this.fileModel.query().findById(id);

		return fileRow
			? ({ ...fileRow.toJSON(), type: FILE_TYPE_AVATAR } as File)
			: null;
	}

	public async findByUserDetailsId(
		userDetailsId: number,
	): Promise<File | null> {
		const userDetails = await this.userDetailsModel
			.query()
			.findById(userDetailsId)
			.select("avatarFileId")
			.first();

		if (!userDetails?.avatarFileId) {
			return null;
		}

		const fileRow = await this.fileModel
			.query()
			.findById(userDetails.avatarFileId);

		if (!fileRow) {
			return null;
		}

		return { ...fileRow.toJSON(), type: FILE_TYPE_AVATAR } as File;
	}

	public async unsetFileId(userDetailsId: number): Promise<number> {
		return await this.userDetailsModel
			.query()
			.patch({ avatarFileId: null })
			.where("id", userDetailsId);
	}

	public async update(
		id: number,
		parameters: { contentType?: string; key: string; url: string },
	): Promise<File> {
		const updatedRow = await this.fileModel
			.query()
			.patchAndFetchById(id, parameters);

		return { ...updatedRow.toJSON(), type: FILE_TYPE_AVATAR } as File;
	}
}

export { FileRepository };
