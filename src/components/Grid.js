// src/components/Grid.js
import React from "react";
import "./Grid.css";

const Grid = ({
	grid,
	onCellClick,
	onCellDoubleClick,
	selectedWord,
	editingCell,
	onCellInput,
	onCellBlur,
	shadedRegion,
}) => {
	const handleKeyPress = (e, rowIndex, cellIndex) => {
		if (e.key === "Enter") {
			const value = e.target.value.toUpperCase();
			if (/[A-Z]/.test(value) && value.length === 1) {
				onCellInput(rowIndex, cellIndex, value);
			}
		}
	};

	return (
		<div className="grid">
			{grid.map((row, rowIndex) => (
				<div
					key={rowIndex}
					className="grid-row">
					{row.map((cell, cellIndex) => {
						let isSelected = false;
						let isEditing = false;
						let isShaded = false;
						if (
							editingCell &&
							editingCell.row === rowIndex &&
							editingCell.col === cellIndex
						) {
							isEditing = true;
						}
						if (selectedWord && selectedWord.position) {
							if (
								selectedWord.orientation === "horizontal" &&
								selectedWord.position.row === rowIndex &&
								selectedWord.position.col <= cellIndex &&
								selectedWord.position.col + selectedWord.word.length > cellIndex
							) {
								isSelected = true;
							} else if (
								selectedWord.orientation === "vertical" &&
								selectedWord.position.col === cellIndex &&
								selectedWord.position.row <= rowIndex &&
								selectedWord.position.row + selectedWord.word.length > rowIndex
							) {
								isSelected = true;
							}
						}
						if (
							rowIndex >= shadedRegion.startRow &&
							rowIndex < shadedRegion.startRow + shadedRegion.height &&
							cellIndex >= shadedRegion.startCol &&
							cellIndex < shadedRegion.startCol + shadedRegion.width
						) {
							isShaded = true;
						}
						return (
							<div
								key={cellIndex}
								className={`grid-cell ${isSelected ? "selected" : ""} ${
									isEditing ? "editing" : ""
								} ${isShaded ? "shaded" : ""}`}
								onClick={() => onCellClick(rowIndex, cellIndex)}
								onDoubleClick={() => onCellDoubleClick(rowIndex, cellIndex)}>
								{isEditing ? (
									<input
										type="text"
										maxLength="1"
										onKeyDown={(e) => handleKeyPress(e, rowIndex, cellIndex)}
										onBlur={(e) =>
											onCellBlur(
												rowIndex,
												cellIndex,
												e.target.value.toUpperCase()
											)
										}
										defaultValue={cell}
										autoFocus
									/>
								) : (
									cell
								)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default Grid;
