import { type Entity } from "~/libs/types/types.js";

class UserDetailsEntity implements Entity {
	private avatarFileId: null | number;
	private firstName: string;

	private id: null | number;

	private lastName: string;

	private userId: number;

	private constructor({
		avatarFileId,
		firstName,
		id,
		lastName,
		userId,
	}: {
		avatarFileId: null | number;
		firstName: string;
		id: null | number;
		lastName: string;
		userId: number;
	}) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.userId = userId;
		this.avatarFileId = avatarFileId;
	}
	public static initialize({
		avatarFileId,
		firstName,
		id,
		lastName,
		userId,
	}: {
		avatarFileId: null | number;
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	}): UserDetailsEntity {
		return new UserDetailsEntity({
			avatarFileId,
			firstName,
			id,
			lastName,
			userId,
		});
	}

	public static initializeNew({
		avatarFileId = null,
		firstName,
		lastName,
		userId,
	}: {
		avatarFileId?: null | number;
		firstName: string;
		lastName: string;
		userId: number;
	}): UserDetailsEntity {
		return new UserDetailsEntity({
			avatarFileId,
			firstName,
			id: null,
			lastName,
			userId,
		});
	}

	public getAvatarFileId(): null | number {
		return this.avatarFileId;
	}

	public toNewObject(): {
		avatarFileId: null | number;
		firstName: string;
		lastName: string;
		userId: number;
	} {
		return {
			avatarFileId: this.avatarFileId,
			firstName: this.firstName,
			lastName: this.lastName,
			userId: this.userId,
		};
	}

	public toObject(): {
		avatarFileId: null | number;
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	} {
		return {
			avatarFileId: this.avatarFileId,
			firstName: this.firstName,
			id: this.id as number,
			lastName: this.lastName,
			userId: this.userId,
		};
	}
}

export { UserDetailsEntity };
