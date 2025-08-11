import { type Knex } from "knex";

const TableName = {
	USER_DETAILS: "user_details",
} as const;

const ColumnName = {
	AVATAR_KEY: "avatar_key",
	AVATAR_URL: "avatar_url",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (table) => {
		table.dropColumn(ColumnName.AVATAR_KEY);
		table.dropColumn(ColumnName.AVATAR_URL);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (table) => {
		table.string(ColumnName.AVATAR_KEY);
		table.string(ColumnName.AVATAR_URL);
	});
}

export { down, up };
