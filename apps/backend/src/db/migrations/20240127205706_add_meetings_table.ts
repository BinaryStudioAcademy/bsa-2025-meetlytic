import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
	USERS: "users",
} as const;

const DELETE_STRATEGY = "CASCADE";
const ColumnName = {
	CREATED_AT: "created_at",
	HOST: "host",
	ID: "id",
	INSTANCE_ID: "instance_id",
	MEETING_ID: "meeting_id",
	MEETING_PASSWORD: "meeting_password",
	OWNER_ID: "owner_id",
	STATUS: "status",
	UPDATED_AT: "updated_at",
} as const;

const MeetingHost = {
	ZOOM: "zoom",
} as const;

const MeetingStatus = {
	ENDED: "ended",
	STARTED: "started",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.MEETINGS);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TableName.MEETINGS, (table) => {
		table.increments(ColumnName.ID).primary();
		table.text(ColumnName.INSTANCE_ID).notNullable();
		table.text(ColumnName.MEETING_ID).notNullable().unique();
		table.text(ColumnName.MEETING_PASSWORD);
		table
			.enu(ColumnName.HOST, Object.values(MeetingHost), {
				enumName: "meeting_host",
				useNative: true,
			})
			.notNullable();
		table
			.enu(ColumnName.STATUS, Object.values(MeetingStatus), {
				enumName: "meeting_status",
				useNative: true,
			})
			.notNullable()
			.defaultTo(MeetingStatus.STARTED);
		table
			.integer(ColumnName.OWNER_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableName.USERS)
			.onDelete(DELETE_STRATEGY);
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
