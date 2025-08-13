import { type Knex } from "knex";

const TableName = {
	FILES: "files",
	USER_DETAILS: "user_details",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.dropColumn("file_id");
	});

	await knex.schema.alterTable(TableName.FILES, (t) => {
		t.integer("user_details_id")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(TableName.USER_DETAILS)
			.onDelete("CASCADE");
		t.string("type").notNullable().defaultTo("avatar");
		t.unique(["user_details_id", "type"]);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.FILES, (t) => {
		t.dropColumn("user_details_id");
	});

	await knex.schema.alterTable(TableName.USER_DETAILS, (t) => {
		t.integer("file_id")
			.unsigned()
			.nullable()
			.references("id")
			.inTable(TableName.FILES)
			.onDelete("SET NULL");
		t.index("file_id");
	});
}

export { down, up };
