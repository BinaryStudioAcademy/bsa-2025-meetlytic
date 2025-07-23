import { type Knex } from "knex";

const TableName = {
	USER_DETAILS: "user_details",
	USERS: "users",
} as const;

const DELETE_STRATEGY = "CASCADE";

const ColumnName = {
	CREATED_AT: "created_at",
	FIRST_NAME: "first_name",
	ID: "id",
	LAST_NAME: "last_name",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.USER_DETAILS);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TableName.USER_DETAILS, (table) => {
		table.increments(ColumnName.ID).primary();
		table.string(ColumnName.FIRST_NAME).notNullable();
		table.string(ColumnName.LAST_NAME).notNullable();
		table
			.integer(ColumnName.USER_ID)
			.unsigned()
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete(DELETE_STRATEGY);
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
