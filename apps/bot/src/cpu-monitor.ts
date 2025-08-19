import fs from "fs";
import os from "os";

const INTERVAL = 2000; // 2 seconds
const LOG_FILE = "cpu-monitor.log";

function logCpuUsage(): void {
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
	const usage: number = ((total - idle) / total) * 100;
	const timestamp: string = new Date().toISOString();

	const logLine: string = `${timestamp} | [CPU] Usage: ${usage.toFixed(2)}%\n`;

	// print to console
	process.stdout.write(logLine);

	// append to file
	fs.appendFileSync(LOG_FILE, logLine);
}

// Run continuously
setInterval(logCpuUsage, INTERVAL);

export { logCpuUsage };
