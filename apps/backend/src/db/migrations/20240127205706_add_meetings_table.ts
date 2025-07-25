import { type Knex } from "knex";

const TABLE_NAME = "meetings";

const ColumnName = {
	CREATED_AT: "created_at",
	HOST: "host",
	ID: "id",
	INSTANCE_ID: "instance_id",
	OWNER_ID: "owner_id",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table.text(ColumnName.INSTANCE_ID).notNullable();
		table.string(ColumnName.HOST).notNullable();
		table
			.integer(ColumnName.OWNER_ID)
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");
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
