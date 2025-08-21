import { type Knex } from "knex";

import { DatabaseTableName } from "~/libs/modules/database/libs/enums/enums.js";

const ColumnName = {
	AVATAR_FILE_ID: "avatar_file_id",
	CONTENT_TYPE: "content_type",
	CREATED_AT: "created_at",
	ID: "id",
	KEY: "key",
	UPDATED_AT: "updated_at",
	URL: "url",
	USER_DETAILS_ID: "user_details_id",
} as const;

const DELETE_SET_NULL = "SET NULL";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(DatabaseTableName.USER_DETAILS, (table) => {
		table.dropColumn(ColumnName.AVATAR_FILE_ID);
	});

	await knex.schema.dropTableIfExists(DatabaseTableName.FILES);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(DatabaseTableName.FILES, (table) => {
		table.increments(ColumnName.ID).primary();
		table.string(ColumnName.CONTENT_TYPE).notNullable();
		table.string(ColumnName.KEY).notNullable();
		table.string(ColumnName.URL).notNullable();
		table
			.timestamp(ColumnName.CREATED_AT)
			.defaultTo(knex.fn.now())
			.notNullable();
		table
			.timestamp(ColumnName.UPDATED_AT)
			.defaultTo(knex.fn.now())
			.notNullable();
	});

	await knex.schema.alterTable(DatabaseTableName.USER_DETAILS, (table) => {
		table
			.integer(ColumnName.AVATAR_FILE_ID)
			.unsigned()
			.nullable()
			.references(ColumnName.ID)
			.inTable(DatabaseTableName.FILES)
			.onDelete(DELETE_SET_NULL);
		table.index(ColumnName.AVATAR_FILE_ID);
	});
}

export { down, up };
