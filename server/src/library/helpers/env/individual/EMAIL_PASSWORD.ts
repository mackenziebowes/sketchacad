import type { ENVExport } from "~/types/env";

const EMAIL_PASSWORD = () => {
	if (!val) throw "EMAIL_PASSWORD not set";
	return val;
};

let val: string | undefined = undefined;

const init = () => {
	env.val = import.meta.env.EMAIL_PASSWORD;
	if (!env.val) throw "EMAIL_PASSWORD not set";
};

const env: ENVExport = {
	get: EMAIL_PASSWORD,
	val,
	init,
};

export default env;
