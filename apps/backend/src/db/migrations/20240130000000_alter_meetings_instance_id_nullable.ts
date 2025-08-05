import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	INSTANCE_ID: "instance_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.text(ColumnName.INSTANCE_ID).notNullable().alter();
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.text(ColumnName.INSTANCE_ID).defaultTo(null).alter();
	});
}

export { down, up };
