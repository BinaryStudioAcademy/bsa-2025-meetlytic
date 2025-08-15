import { type Knex } from "knex";

const TableName = {
	MEETING_AUDIO: "meeting_audio",
	MEETINGS: "meetings",
} as const;

const Column = {
	CREATED_AT: "created_at",
	FILE_NAME: "file_name",
	FILE_URL: "file_url",
	ID: "id",
	MEETING_ID: "meeting_id",
	UPDATED_AT: "updated_at",
} as const;

const DELETE_STRATEGY = "CASCADE";

async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TableName.MEETING_AUDIO);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.MEETING_AUDIO, (table) => {
		table.increments(Column.ID).primary();
		table
			.integer(Column.MEETING_ID)
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(TableName.MEETINGS)
			.onDelete(DELETE_STRATEGY);
		table.string(Column.FILE_NAME).notNullable();
		table.text(Column.FILE_URL).notNullable();
		table.dateTime(Column.CREATED_AT).notNullable().defaultTo(knex.fn.now());
		table.dateTime(Column.UPDATED_AT).notNullable().defaultTo(knex.fn.now());
	});
}

export { down, up };
