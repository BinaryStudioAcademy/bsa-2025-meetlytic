import { type Entity } from "~/libs/types/types.js";

class UserDetailsEntity implements Entity {
	private firstName: string;

	private id: null | number;

	private lastName: string;

	private userId: number;

	private constructor({
		firstName,
		id,
		lastName,
		userId,
	}: {
		firstName: string;
		id: null | number;
		lastName: string;
		userId: number;
	}) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.userId = userId;
	}

	public static initialize({
		firstName,
		id,
		lastName,
		userId,
	}: {
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	}): UserDetailsEntity {
		return new UserDetailsEntity({
			firstName,
			id,
			lastName,
			userId,
		});
	}

	public static initializeNew({
		firstName,
		lastName,
		userId,
	}: {
		firstName: string;
		lastName: string;
		userId: number;
	}): UserDetailsEntity {
		return new UserDetailsEntity({
			firstName,
			id: null,
			lastName,
			userId,
		});
	}

	public toNewObject(): {
		firstName: string;
		lastName: string;
		userId: number;
	} {
		return {
			firstName: this.firstName,
			lastName: this.lastName,
			userId: this.userId,
		};
	}

	public toObject(): {
		firstName: string;
		id: number;
		lastName: string;
		userId: number;
	} {
		return {
			firstName: this.firstName,
			id: this.id as number,
			lastName: this.lastName,
			userId: this.userId,
		};
	}
}

export { UserDetailsEntity };
