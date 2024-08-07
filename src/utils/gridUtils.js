// src/utils/gridUtils.js

export const translateGridState = (grid) => {
	return grid.map((row) =>
		row.map((cell) => {
			if (cell === null) {
				return ["##"];
			} else if (/[A-Za-z]/.test(cell)) {
				return [`${cell.toUpperCase()}_`];
			} else if (/[0-9]/.test(cell)) {
				return [cell.padStart(2, "0")];
			}
			return ["##"];
		})
	);
};
