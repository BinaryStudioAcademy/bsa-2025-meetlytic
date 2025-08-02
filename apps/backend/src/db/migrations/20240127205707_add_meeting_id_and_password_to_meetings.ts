import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	MEETING_ID: "meeting_id",
	MEETING_PASSWORD: "meeting_password",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.dropColumn(ColumnName.MEETING_ID);
		table.dropColumn(ColumnName.MEETING_PASSWORD);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.text(ColumnName.MEETING_ID).notNullable().unique();
		table.text(ColumnName.MEETING_PASSWORD);
	});
}

export { down, up };
