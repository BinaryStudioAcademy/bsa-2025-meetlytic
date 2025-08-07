import { type Entity } from "~/libs/types/types.js";

class UserEntity implements Entity {
	private avatarKey: null | string;

	private avatarUrl: null | string;

	private email: string;

	private id: null | number;

	private passwordHash: string;

	private passwordSalt: string;

	private constructor({
		avatarKey,
		avatarUrl,
		email,
		id,
		passwordHash,
		passwordSalt,
	}: {
		avatarKey?: null | string | undefined;
		avatarUrl?: null | string | undefined;
		email: string;
		id: null | number;
		passwordHash: string;
		passwordSalt: string;
	}) {
		this.id = id;
		this.email = email;
		this.passwordHash = passwordHash;
		this.passwordSalt = passwordSalt;
		this.avatarKey = avatarKey ?? null;
		this.avatarUrl = avatarUrl ?? null;
	}

	public static initialize({
		avatarKey,
		avatarUrl,
		email,
		id,
		passwordHash,
		passwordSalt,
	}: {
		avatarKey?: null | string;
		avatarUrl?: null | string;
		email: string;
		id: number;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			avatarKey,
			avatarUrl,
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
		avatarKey: null | string;
		avatarUrl: null | string;
		email: string;
		id: number;
	} {
		return {
			avatarKey: this.avatarKey,
			avatarUrl: this.avatarUrl,
			email: this.email,
			id: this.id as number,
		};
	}
}

export { UserEntity };
