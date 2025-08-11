import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	ACTION_ITEMS: "action_items",
	SUMMARY: "summary",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.dropColumn(ColumnName.ACTION_ITEMS);
		table.dropColumn(ColumnName.SUMMARY);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.text(ColumnName.ACTION_ITEMS);
		table.text(ColumnName.SUMMARY);
	});
}

export { down, up };
