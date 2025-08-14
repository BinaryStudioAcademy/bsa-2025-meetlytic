import { type Knex } from "knex";

const TableName = {
	FILES: "files",
	USER_DETAILS: "user_details",
} as const;

const ColumnName = {
	AVATAR_KEY: "avatar_key",
	AVATAR_URL: "avatar_url",
	CREATED_AT: "created_at",
	ID: "id",
	KEY: "key",
	TYPE: "type",
	UPDATED_AT: "updated_at",
	URL: "url",
	USER_DETAILS_ID: "user_details_id",
} as const;

const DELETE_STRATEGY = "CASCADE";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.string(ColumnName.AVATAR_KEY);
		t.string(ColumnName.AVATAR_URL);
	});

	await knex.schema.dropTableIfExists(TableName.FILES);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.FILES, (t) => {
		t.increments(ColumnName.ID).primary();
		t.string(ColumnName.KEY).notNullable();
		t.string(ColumnName.URL).notNullable();
		t.integer(ColumnName.USER_DETAILS_ID)
			.unsigned()
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USER_DETAILS)
			.onDelete(DELETE_STRATEGY);
		t.string(ColumnName.TYPE).notNullable().defaultTo("avatar");
		t.timestamps(true, true);
		t.unique([ColumnName.USER_DETAILS_ID, ColumnName.TYPE]);
	});

	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.dropColumn(ColumnName.AVATAR_KEY);
		t.dropColumn(ColumnName.AVATAR_URL);
	});
}

export { down, up };
