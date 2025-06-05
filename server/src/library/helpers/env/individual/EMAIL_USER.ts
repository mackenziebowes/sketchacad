import type { ENVExport } from "~/types/env";

const EMAIL_USER = () => {
	if (!val) throw "EMAIL_USER not set";
	return val;
};

let val: string | undefined = undefined;

const init = () => {
	env.val = import.meta.env.EMAIL_USER;
	if (!env.val) throw "EMAIL_USER not set";
};

const env: ENVExport = {
	get: EMAIL_USER,
	val,
	init,
};

export default env;
