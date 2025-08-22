import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	MEETING_TITLE: "meeting_title",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.dropColumn(ColumnName.MEETING_TITLE);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.text(ColumnName.MEETING_TITLE);
	});
}

export { down, up };
