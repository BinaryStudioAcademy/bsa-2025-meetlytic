import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	TITLE: "title",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.dropColumn(ColumnName.TITLE);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.text(ColumnName.TITLE);
	});
}

export { down, up };
