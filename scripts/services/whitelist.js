const fs = require('node:fs');
const path = require('node:path');
const logger = require('../logger.js');
const isSpecialPurposeIP = require('../isSpecialPurposeIP.js');

const filePath = path.resolve(__dirname, '..', '..', 'whitelist.txt');
let whitelistedIPs = new Set();
let whitelistedPorts = new Set(); // @chillcog Port Whitelist
let reloadTimer = null;

const parse = content => {
	// @chillcog Port Whitelist
	const ipSet = new Set();
	const portSet = new Set();

	const invalidIPs = [], skippedIPs = [];
	const invalidPorts = [], skippedPorts = [];

	let section = 'ip';
	const lines = content.split('\n');

	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i];

		const header = raw.trim().toLowerCase();
		if (header.includes('[port whitelist]') || (header.includes('port whitelist') && header.includes('['))) {
			section = 'port';
			continue;
		}
		if (header.includes('[ip whitelist]') || (header.includes('ip whitelist') && header.includes('['))) {
			section = 'ip';
			continue;
		}

		const line = raw.split('#')[0].trim();
		if (!line) continue;

		if (section === 'port') {
			const portStr = String(line).split(':').pop().split('/')[0].trim();
			const port = Number(portStr);
			if (!Number.isInteger(port) || port < 1 || port > 65535) {
				invalidPorts.push(`${line} (line ${i + 1})`);
				continue;
			}

			if (portSet.has(port)) {
				skippedPorts.push(`${line} (line ${i + 1})`);
				continue;
			}

			portSet.add(port);
			continue;
		}

		const { is, range } = isSpecialPurposeIP(line);
		if (range === null) {
			invalidIPs.push(`${line} (line ${i + 1})`);
			continue;
		}

		if (is) {
			skippedIPs.push(`${line} (${range})`);
			continue;
		}

		ipSet.add(line);
	}

	if (invalidIPs.length > 0) {
		logger.warn(`Invalid IP address${invalidIPs.length > 1 ? 'es' : ''} in whitelist, skipping: ${invalidIPs.join(', ')}`);
	}

	if (skippedIPs.length > 0) {
		logger.warn(`Special-purpose IP${skippedIPs.length > 1 ? 's' : ''} detected in whitelist.txt, was this intentional? ${skippedIPs.join(', ')}`);
	}

	if (invalidPorts.length > 0) {
		logger.warn(`Invalid port${invalidPorts.length > 1 ? 's' : ''} in whitelist, skipping: ${invalidPorts.join(', ')}`);
	}

	if (skippedPorts.length > 0) {
		logger.warn(`Skipped duplicate port${skippedPorts.length > 1 ? 's' : ''} in whitelist.txt: ${skippedPorts.join(', ')}`);
	}

	return { ipSet, portSet };
};

const load = () => {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		const { ipSet, portSet } = parse(content);
		whitelistedIPs = ipSet;
		whitelistedPorts = portSet;

		if (whitelistedIPs.size > 0) logger.info(`Loaded ${whitelistedIPs.size} whitelisted IP${whitelistedIPs.size > 1 ? 's' : ''} from ${filePath}`);
		if (whitelistedPorts.size > 0) logger.info(`Loaded ${whitelistedPorts.size} whitelisted port${whitelistedPorts.size > 1 ? 's' : ''} from ${filePath}`);
	} catch (err) {
		logger.error(`Failed to load whitelist file: ${err.message}`);
	}
};

const initWhitelist = () => {
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(
			filePath,
			[
				'# UFW AbuseIPDB Reporter - whitelist.txt',
				'# Changes to this file are detected and applied automatically (no restart required)',
				'',
				'# ====== [IP WHITELIST] ======',
				'# One IP address per line (IPv4 or IPv6)',
				'# Lines starting with # are comments',
				'#',
				'# Examples:',
				'# 79.186.0.0',
				'# 2a01:11bf:4504:b10c:8a32:ffe7:510a:6d4e',
				'',
				'# ====== [PORT WHITELIST] ======',
				'# One destination port per line. Applies to ALL IPs.',
				'# Optional: you may write entries like "22/tcp"; the numeric port will be extracted.',
				'# Added if you have certain services that trigger false positives and you want to exclude',
				'# them from triggering reports regardless of source IP. Use with caution, as this will ignore',
				'# all traffic to the specified port(s) and may cause you to miss legitimate reports if that port is attacked.',
				'# Examples:',
				'# 22',
				'# 25565',
				'# 1194/tcp',
			].join('\n') + '\n'
		);
		logger.info(`Created default whitelist file: ${filePath}`);
	}
    // @chillcog end;
	load();

	const dir = path.dirname(filePath);
	const filename = path.basename(filePath);

	try {
		const watcher = fs.watch(dir, (event, file) => {
			if (file !== filename) return;
			clearTimeout(reloadTimer);
			reloadTimer = setTimeout(load, 200);
		});
		watcher.on('error', err => logger.error(`Whitelist watcher error: ${err.message}`));
	} catch (err) {
		logger.error(`Failed to watch whitelist file: ${err.message}`);
	}
};

module.exports = {
	initWhitelist,
	isWhitelisted: ip => whitelistedIPs.has(ip),
	isPortWhitelisted: port => whitelistedPorts.has(port),
};
