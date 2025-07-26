import { type Knex } from "knex";

import { MeetingHost } from "~/modules/meetings/meetings.js";

const TableName = {
	MEETINGS: "meetings",
	USERS: "users",
} as const;

const DELETE_STRATEGY = "CASCADE";
const ColumnName = {
	CREATED_AT: "created_at",
	HOST: "host",
	ID: "id",
	INSTANCE_ID: "instance_id",
	OWNER_ID: "owner_id",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.MEETINGS);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TableName.MEETINGS, (table) => {
		table.increments(ColumnName.ID).primary();
		table.text(ColumnName.INSTANCE_ID).notNullable();
		table.enu(ColumnName.HOST, Object.values(MeetingHost)).notNullable();
		table
			.integer(ColumnName.OWNER_ID)
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
