// src/components/Grid.js
import React from "react";
import "./Grid.css";

const Grid = ({ grid, onCellClick, onCellDoubleClick, selectedWord }) => {
	return (
		<div className="grid">
			{grid.map((row, rowIndex) => (
				<div
					key={rowIndex}
					className="grid-row">
					{row.map((cell, cellIndex) => {
						let isSelected = false;
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
						return (
							<div
								key={cellIndex}
								className={`grid-cell ${isSelected ? "selected" : ""}`}
								onClick={() => onCellClick(rowIndex, cellIndex)}
								onDoubleClick={() => onCellDoubleClick(rowIndex, cellIndex)}>
								{cell}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default Grid;
