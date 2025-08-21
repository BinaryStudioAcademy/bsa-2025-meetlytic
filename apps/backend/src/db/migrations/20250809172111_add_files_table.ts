import { type Knex } from "knex";

const TableName = {
	FILES: "files",
} as const;

const ColumnName = {
	CONTENT_TYPE: "content_type",
	CREATED_AT: "created_at",
	ID: "id",
	KEY: "key",
	UPDATED_AT: "updated_at",
	URL: "url",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.FILES);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TableName.FILES, (table) => {
		table.increments(ColumnName.ID).primary();
		table.text(ColumnName.KEY).notNullable().unique();
		table.text(ColumnName.URL).notNullable();
		table.text(ColumnName.CONTENT_TYPE).notNullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

export { down, up };
