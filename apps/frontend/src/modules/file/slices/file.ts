import { getFileById } from "./actions.js";
import { actions } from "./file.slice.js";

const allActions = {
	...actions,
	getFileById,
};

export { allActions as actions };
export { reducer } from "./file.slice.js";
