import { type Entity } from "~/libs/types/types.js";
import { type UserDetailsEntity } from "~/modules/users/user-details.entity.js";

class UserEntity implements Entity {
	private details: null | UserDetailsEntity;

	private email: string;

	private id: null | number;

	private passwordHash: string;

	private passwordSalt: string;

	private constructor({
		details = null,
		email,
		id,
		passwordHash,
		passwordSalt,
	}: {
		details?: null | UserDetailsEntity;
		email: string;
		id: null | number;
		passwordHash: string;
		passwordSalt: string;
	}) {
		this.id = id;
		this.email = email;
		this.passwordHash = passwordHash;
		this.passwordSalt = passwordSalt;
		this.details = details ?? null;
	}

	public static initialize({
		details = null,
		email,
		id,
		passwordHash,
		passwordSalt,
	}: {
		details?: null | UserDetailsEntity;
		email: string;
		id: number;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			details,
			email,
			id,
			passwordHash,
			passwordSalt,
		});
	}

	public static initializeNew({
		email,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			email,
			id: null,
			passwordHash,
			passwordSalt,
		});
	}

	public getDetails(): null | UserDetailsEntity {
		return this.details;
	}

	public toNewObject(): {
		email: string;
		passwordHash: string;
		passwordSalt: string;
	} {
		return {
			email: this.email,
			passwordHash: this.passwordHash,
			passwordSalt: this.passwordSalt,
		};
	}

	public toObject(): {
		details: null | {
			firstName: string;
			id: number;
			lastName: string;
			userId: number;
		};
		email: string;
		id: number;
	} {
		return {
			details: this.details ? this.details.toObject() : null,
			email: this.email,
			id: this.id as number,
		};
	}
}

export { UserEntity };
