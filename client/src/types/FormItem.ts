import type { Accessor, Setter } from "solid-js";

export interface FormItemState<T> {
	get: Accessor<T>;
	set: Setter<T>;
}
