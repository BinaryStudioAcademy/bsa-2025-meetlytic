import { type Knex } from "knex";

const TableName = {
	USER_DETAILS: "user_details",
} as const;

const ColumnName = {
	AVATAR_FILE_ID: "avatar_file_id",
	FILE_ID: "file_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (table) => {
		table.renameColumn(ColumnName.AVATAR_FILE_ID, ColumnName.FILE_ID);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (table) => {
		table.renameColumn(ColumnName.FILE_ID, ColumnName.AVATAR_FILE_ID);
	});
}

export { down, up };
