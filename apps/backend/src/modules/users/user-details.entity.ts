import { type Entity } from "~/libs/types/types.js";

class UserDetailsEntity implements Entity {
	private fileId: null | number;
	private firstName: string;

	private id: null | number;

	private lastName: string;

	private userId: number;

	private constructor({
		fileId,
		firstName,
		id,
		lastName,
		userId,
	}: {
		fileId: null | number;
		firstName: string;
		id: null | number;
		lastName: string;
		userId: number;
	}) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.userId = userId;
		this.fileId = fileId;
	}

	public static initialize({
		fileId,
		firstName,
		id,
		lastName,
		userId,
	}: {
		fileId: null | number;
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	}): UserDetailsEntity {
		return new UserDetailsEntity({
			fileId,
			firstName,
			id,
			lastName,
			userId,
		});
	}

	public static initializeNew({
		fileId = null,
		firstName,
		lastName,
		userId,
	}: {
		fileId?: null | number;
		firstName: string;
		lastName: string;
		userId: number;
	}): UserDetailsEntity {
		return new UserDetailsEntity({
			fileId,
			firstName,
			id: null,
			lastName,
			userId,
		});
	}

	public toNewObject(): {
		fileId: null | number;
		firstName: string;
		lastName: string;
		userId: number;
	} {
		return {
			fileId: this.fileId,
			firstName: this.firstName,
			lastName: this.lastName,
			userId: this.userId,
		};
	}

	public toObject(): {
		fileId: null | number;
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	} {
		return {
			fileId: this.fileId,
			firstName: this.firstName,
			id: this.id as number,
			lastName: this.lastName,
			userId: this.userId,
		};
	}
}

export { UserDetailsEntity };
