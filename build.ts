import { $ } from "bun";
import { log } from "~/log";

interface BuildOptions {
	"fileName": string;
	"target": string;
	"arch"?: string;
}

const targets = {
	"linux": {
		"label": "Linux",
		"arm": true
	},
	"darwin": {
		"label": "macOS",
		"arm": true
	},
	"windows": {
		"label": "Windows",
		"arm": false
	}
};

async function build({ fileName, target, arch = "x64-modern" }: BuildOptions) {
	if (arch === "arm64") {
		fileName += "-arm";
	}

	const result = await $`bun build --compile --minify --sourcemap src/index.ts --target=bun-${target}-${arch} --outfile build/${fileName}`.text();
	log.debug(result);
}

for (const [target, value] of Object.entries(targets)) {
	log.info(`Building for ${value.label}...`);

	const options: BuildOptions = {
		"fileName": `ohm-${value.label.toLowerCase()}`,
		"target": target
	};

	await build(options);
	log.info("Built x64 binary.");

	if (value.arm) {
		await build({
			...options,
			"arch": "arm64"
		});

		log.info("Built ARM binary.");
	}
}
