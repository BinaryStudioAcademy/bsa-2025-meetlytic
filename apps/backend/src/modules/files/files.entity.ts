import { type Entity } from "~/libs/types/types.js";

import {
	type FileRequestProperties,
	type FileResponseProperties,
} from "./libs/types/types.js";

type Constructor = {
	contentType: string;
	createdAt: null | string;
	id: null | number;
	key: string;
	updatedAt: null | string;
	url: string;
};

class FileEntity implements Entity {
	private contentType: string;
	private createdAt: null | string;
	private id: null | number;
	private key: string;
	private updatedAt: null | string;
	private url: string;

	private constructor({
		contentType,
		createdAt,
		id,
		key,
		updatedAt,
		url,
	}: Constructor) {
		this.contentType = contentType;
		this.createdAt = createdAt;
		this.id = id;
		this.key = key;
		this.updatedAt = updatedAt;
		this.url = url;
	}

	public static initialize({
		contentType,
		createdAt,
		id,
		key,
		updatedAt,
		url,
	}: FileResponseProperties): FileEntity {
		return new FileEntity({
			contentType,
			createdAt,
			id,
			key,
			updatedAt,
			url,
		});
	}

	public static initializeNew({
		contentType,
		key,
		url,
	}: FileRequestProperties): FileEntity {
		return new FileEntity({
			contentType,
			createdAt: null,
			id: null,
			key,
			updatedAt: null,
			url,
		});
	}

	public toNewObject(): FileRequestProperties {
		return {
			contentType: this.contentType,
			key: this.key,
			url: this.url,
		};
	}

	public toObject(): FileResponseProperties {
		return {
			contentType: this.contentType,
			createdAt: this.createdAt as string,
			id: this.id as number,
			key: this.key,
			updatedAt: this.updatedAt as string,
			url: this.url,
		};
	}
}

export { FileEntity };
