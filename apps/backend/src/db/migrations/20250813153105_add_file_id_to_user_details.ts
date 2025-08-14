import { type Knex } from "knex";

const TableName = {
	FILES: "files",
	USER_DETAILS: "user_details",
} as const;

const ColumnName = {
	FILE_ID: "file_id",
	ID: "id",
	TYPE: "type",
	USER_DETAILS_ID: "user_details_id",
} as const;

const DEFAULT_FILE_TYPE = "avatar";
const DELETE_STRATEGY = "CASCADE";
const DELETE_SET_NULL = "SET NULL";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.dropColumn(ColumnName.FILE_ID);
	});

	await knex.schema.alterTable(TableName.FILES, (t) => {
		t.integer(ColumnName.USER_DETAILS_ID)
			.unsigned()
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USER_DETAILS)
			.onDelete(DELETE_STRATEGY);
		t.string(ColumnName.TYPE).notNullable().defaultTo(DEFAULT_FILE_TYPE);
		t.unique([ColumnName.USER_DETAILS_ID, ColumnName.TYPE]);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.FILES, (t) => {
		t.dropColumn(ColumnName.USER_DETAILS_ID);
	});

	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.integer(ColumnName.FILE_ID)
			.unsigned()
			.nullable()
			.references(ColumnName.ID)
			.inTable(TableName.FILES)
			.onDelete(DELETE_SET_NULL);
		t.index(ColumnName.FILE_ID);
	});
}

export { down, up };
