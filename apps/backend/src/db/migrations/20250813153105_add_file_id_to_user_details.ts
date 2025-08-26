import { type Knex } from "knex";

const TableName = {
	FILES: "files",
	USER_DETAILS: "user_details",
} as const;

const ColumnName = {
	AVATAR_FILE_ID: "avatar_file_id",
	ID: "id",
} as const;

const DELETE_STRATEGY = "SET NULL";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (table) => {
		table.dropColumn(ColumnName.AVATAR_FILE_ID);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (table) => {
		table
			.integer(ColumnName.AVATAR_FILE_ID)
			.unsigned()
			.nullable()
			.references(ColumnName.ID)
			.inTable(TableName.FILES)
			.onDelete(DELETE_STRATEGY)
			.index();
	});
}

export { down, up };
