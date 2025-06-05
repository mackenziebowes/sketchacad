import type { ENVExport } from "~/types/env";

const EMAIL_HOST = () => {
	if (!val) throw "EMAIL_HOST not set";
	return val;
};

let val: string | undefined = undefined;

const init = () => {
	env.val = import.meta.env.EMAIL_HOST;
	if (!env.val) throw "EMAIL_HOST not set";
};

const env: ENVExport = {
	get: EMAIL_HOST,
	val,
	init,
};

export default env;
