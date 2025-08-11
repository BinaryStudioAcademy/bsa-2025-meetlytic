import { type Knex } from "knex";

const TableName = {
	FILES: "files",
	USER_DETAILS: "user_details",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.string("avatar_key");
		t.string("avatar_url");
	});

	await knex.schema.dropTableIfExists(TableName.FILES);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.FILES, (t) => {
		t.increments("id").primary();
		t.string("key").notNullable();
		t.string("url").notNullable();
		t.integer("user_details_id")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(TableName.USER_DETAILS)
			.onDelete("CASCADE");
		t.string("type").notNullable().defaultTo("avatar");
		t.timestamps(true, true);
		t.unique(["user_details_id", "type"]);
	});

	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.dropColumn("avatar_key");
		t.dropColumn("avatar_url");
	});
}

export { down, up };
