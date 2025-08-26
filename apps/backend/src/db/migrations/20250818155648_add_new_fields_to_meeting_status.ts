import { type Knex } from "knex";

const TableName = {
	MEETINGS: "meetings",
} as const;

const ColumnName = {
	STATUS: "status",
} as const;

const ENUM_NAME = "meeting_status";

const MeetingStatus = {
	ENDED: "ended",
	FAILED: "failed",
	JOINING: "joining",
	RECORDING: "recording",
	STARTED: "started",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx(TableName.MEETINGS)
			.whereIn(ColumnName.STATUS, [
				MeetingStatus.FAILED,
				MeetingStatus.JOINING,
				MeetingStatus.RECORDING,
			])
			.update({ [ColumnName.STATUS]: MeetingStatus.ENDED });

		const temporary = `${ENUM_NAME}_old`;

		await trx.raw(`ALTER TYPE "${ENUM_NAME}" RENAME TO "${temporary}";`);
		await trx.raw(
			`CREATE TYPE "${ENUM_NAME}" AS ENUM ('${MeetingStatus.ENDED}', '${MeetingStatus.STARTED}');`,
		);
		await trx.raw(
			` ALTER TABLE "${TableName.MEETINGS}" ALTER COLUMN "${ColumnName.STATUS}" TYPE "${ENUM_NAME}" USING "${ColumnName.STATUS}"::text::"${ENUM_NAME}";`,
		);
		await trx.raw(`DROP TYPE "${temporary}";`);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.raw(
		`ALTER TYPE "${ENUM_NAME}" ADD VALUE IF NOT EXISTS '${MeetingStatus.FAILED}';`,
	);
	await knex.raw(
		`ALTER TYPE "${ENUM_NAME}" ADD VALUE IF NOT EXISTS '${MeetingStatus.JOINING}';`,
	);
	await knex.raw(
		`ALTER TYPE "${ENUM_NAME}" ADD VALUE IF NOT EXISTS '${MeetingStatus.RECORDING}';`,
	);
}

export { down, up };
