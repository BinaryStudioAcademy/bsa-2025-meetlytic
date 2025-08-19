import { type Knex } from "knex";

const TableName = {
	FILES: "files",
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	AUDIO_FILE_ID: "audio_file_id",
	ID: "id",
} as const;

const DELETE_STRATEGY = "SET NULL";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table.dropColumn(ColumnName.AUDIO_FILE_ID);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TableName.MEETINGS, (table) => {
		table
			.integer(ColumnName.AUDIO_FILE_ID)
			.unsigned()
			.nullable()
			.references(ColumnName.ID)
			.inTable(TableName.FILES)
			.onDelete(DELETE_STRATEGY)
			.index();
	});
}

export { down, up };
