const MEMORY_UNIT_SIZE = 1024;

const bytesToMegabytes = (bytes: number): string =>
	Math.floor(bytes / (MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE)).toString();

export { bytesToMegabytes };
