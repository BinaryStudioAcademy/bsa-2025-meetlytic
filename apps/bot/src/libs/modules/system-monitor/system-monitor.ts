import fs from "node:fs";
import os from "node:os";

const INTERVAL = 2000;
const LOG_FILE = "/home/ubuntu/system-monitor.log";

const BYTES_IN_KB = 1024;
const BYTES_IN_MB = BYTES_IN_KB * BYTES_IN_KB;
const DECIMALS = 2;
const PERCENT = 100;

const logCpuMemoryUsage = (): void => {
	const cpus: os.CpuInfo[] = os.cpus();

	let user = 0;
	let nice = 0;
	let sys = 0;
	let idle = 0;
	let irq = 0;

	for (const cpu of cpus) {
		user += cpu.times.user;
		nice += cpu.times.nice;
		sys += cpu.times.sys;
		idle += cpu.times.idle;
		irq += cpu.times.irq;
	}

	const total = user + nice + sys + idle + irq;
	const cpuUsage: number = ((total - idle) / total) * PERCENT;

	const totalMem = os.totalmem();
	const freeMem = os.freemem();
	const usedMem = totalMem - freeMem;
	const memUsagePercent: number = (usedMem / totalMem) * PERCENT;

	const timestamp: string = new Date().toISOString();
	const logLine: string = `${timestamp} | [CPU] Usage: ${cpuUsage.toFixed(
		DECIMALS,
	)}% | [Memory] Usage: ${(usedMem / BYTES_IN_MB).toFixed(DECIMALS)}MB (${memUsagePercent.toFixed(
		DECIMALS,
	)}%)\n`;

	process.stdout.write(logLine);
	fs.appendFileSync(LOG_FILE, logLine);
};

setInterval(logCpuMemoryUsage, INTERVAL);

export { logCpuMemoryUsage };
