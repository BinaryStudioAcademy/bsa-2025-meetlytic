import { type Knex } from "knex";

const TableName = {
	MEETING_TRANSCRIPTIONS: "meeting_transcriptions",
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	CHUNK_TEXT: "chunk_text",
	CREATED_AT: "created_at",
	ID: "id",
	MEETING_REF_ID: "meeting_ref_id",
	UPDATED_AT: "updated_at",
} as const;

const DELETE_STRATEGY = "CASCADE";

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.MEETING_TRANSCRIPTIONS);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TableName.MEETING_TRANSCRIPTIONS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.MEETING_REF_ID)
			.unsigned()
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.MEETINGS)
			.onDelete(DELETE_STRATEGY);
		table.text(ColumnName.CHUNK_TEXT).notNullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

export { down, up };
