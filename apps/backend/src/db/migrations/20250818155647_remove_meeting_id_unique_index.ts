import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	MEETING_ID: "meeting_id",
} as const;

const IndexName = "meetings_meeting_id_unique";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.unique([ColumnName.MEETING_ID], { indexName: IndexName });
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.dropUnique([ColumnName.MEETING_ID], IndexName);
	});
}

export { down, up };
