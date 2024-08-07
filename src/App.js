import React, { useState } from "react";
import Grid from "./components/Grid";
import Word from "./components/Word";
import HoldingArea from "./components/HoldingArea";
import { translateGridState } from "./utils/gridUtils"; // Import the utility function
import "./App.css";

const App = () => {
	const [gridWidth, setGridWidth] = useState(10);
	const [gridHeight, setGridHeight] = useState(10);
	const [grid, setGrid] = useState(
		Array(gridHeight)
			.fill(null)
			.map(() => Array(gridWidth).fill(null))
	);
	const [words, setWords] = useState([]);
	const [selectedWord, setSelectedWord] = useState(null);
	const [editingCell, setEditingCell] = useState(null);
	const [shadedRegion, setShadedRegion] = useState({
		width: 3,
		height: 3,
		startRow: 0,
		startCol: 0,
	});
	const [manualEntries, setManualEntries] = useState([]);
	const [visualGrid, setVisualGrid] = useState([]);

	const handleSelectWord = (word) => {
		console.log(`Selected word: ${word.word}`);
		setSelectedWord(word);
	};

	const handleGridCellClick = (rowIndex, cellIndex) => {
		if (selectedWord) {
			console.log(
				`Placing word: ${selectedWord.word} at (${rowIndex}, ${cellIndex})`
			);

			const wordIndex = words.findIndex((w) => w.word === selectedWord.word);
			if (wordIndex === -1) {
				console.error("Selected word not found in words list.");
				return;
			}

			const newWords = [...words];
			newWords[wordIndex].position = { row: rowIndex, col: cellIndex };

			const newGrid = Array(gridHeight)
				.fill(null)
				.map(() => Array(gridWidth).fill(null));
			newWords.forEach(({ word, orientation, position }) => {
				if (position) {
					for (let i = 0; i < word.length; i++) {
						if (orientation === "horizontal") {
							newGrid[position.row][position.col + i] = word[i];
						} else {
							newGrid[position.row + i][position.col] = word[i];
						}
					}
				}
			});

			manualEntries.forEach(({ row, col, value }) => {
				newGrid[row][col] = value;
			});

			setGrid(newGrid);
			setWords(newWords);
			setSelectedWord(null);
		} else if (grid[rowIndex][cellIndex]) {
			const wordChar = grid[rowIndex][cellIndex];
			const selectedGridWord = words.find(
				(word) =>
					word.word.includes(wordChar) &&
					word.position &&
					((word.orientation === "horizontal" &&
						word.position.row === rowIndex &&
						word.position.col <= cellIndex &&
						word.position.col + word.word.length > cellIndex) ||
						(word.orientation === "vertical" &&
							word.position.col === cellIndex &&
							word.position.row <= rowIndex &&
							word.position.row + word.word.length > rowIndex))
			);

			if (selectedGridWord) {
				console.log(`Selected word from grid: ${selectedGridWord.word}`);
				setSelectedWord(selectedGridWord);
			} else {
				setEditingCell({ row: rowIndex, col: cellIndex });
			}
		} else {
			setEditingCell({ row: rowIndex, col: cellIndex });
		}
	};

	const handleGridCellDoubleClick = (rowIndex, cellIndex) => {
		if (grid[rowIndex][cellIndex]) {
			const wordChar = grid[rowIndex][cellIndex];
			const selectedGridWord = words.find(
				(word) =>
					word.word.includes(wordChar) &&
					word.position &&
					((word.orientation === "horizontal" &&
						word.position.row === rowIndex &&
						word.position.col <= cellIndex &&
						word.position.col + word.word.length > cellIndex) ||
						(word.orientation === "vertical" &&
							word.position.col === cellIndex &&
							word.position.row <= rowIndex &&
							word.position.row + word.word.length > rowIndex))
			);

			if (selectedGridWord) {
				console.log(`Toggling orientation for word: ${selectedGridWord.word}`);

				const newWords = words.map((w) => {
					if (w.word === selectedGridWord.word) {
						const newOrientation =
							w.orientation === "horizontal" ? "vertical" : "horizontal";
						return { ...w, orientation: newOrientation };
					}
					return w;
				});

				const newGrid = Array(gridHeight)
					.fill(null)
					.map(() => Array(gridWidth).fill(null));
				newWords.forEach(({ word, orientation, position }) => {
					if (position) {
						for (let i = 0; i < word.length; i++) {
							if (orientation === "horizontal") {
								newGrid[position.row][position.col + i] = word[i];
							} else {
								newGrid[position.row + i][position.col] = word[i];
							}
						}
					}
				});

				manualEntries.forEach(({ row, col, value }) => {
					newGrid[row][col] = value;
				});

				setGrid(newGrid);
				setWords(newWords);
			}
		}
	};

	const handleAddWord = (newWord) => {
		setWords([
			...words,
			{ word: newWord, orientation: "horizontal", position: null },
		]);
	};

	const handleDeleteWord = () => {
		if (selectedWord) {
			const newWords = words.filter((w) => w.word !== selectedWord.word);
			const newGrid = Array(gridHeight)
				.fill(null)
				.map(() => Array(gridWidth).fill(null));
			newWords.forEach(({ word, orientation, position }) => {
				if (position) {
					for (let i = 0; i < word.length; i++) {
						if (orientation === "horizontal") {
							newGrid[position.row][position.col + i] = word[i];
						} else {
							newGrid[position.row + i][position.col] = word[i];
						}
					}
				}
			});

			manualEntries.forEach(({ row, col, value }) => {
				newGrid[row][col] = value;
			});

			setGrid(newGrid);
			setWords(newWords);
			setSelectedWord(null);
		}
	};

	const handleIncreaseGridWidth = () => {
		const newGridWidth = gridWidth + 1;
		const newGrid = Array(gridHeight)
			.fill(null)
			.map(() => Array(newGridWidth).fill(null));

		words.forEach(({ word, orientation, position }) => {
			if (position) {
				for (let i = 0; i < word.length; i++) {
					if (orientation === "horizontal") {
						newGrid[position.row][position.col + i] = word[i];
					} else {
						newGrid[position.row + i][position.col] = word[i];
					}
				}
			}
		});

		manualEntries.forEach(({ row, col, value }) => {
			newGrid[row][col] = value;
		});

		setGridWidth(newGridWidth);
		setGrid(newGrid);
	};

	const handleDecreaseGridWidth = () => {
		if (gridWidth <= 1) return; // Prevent decreasing width below 1
		const newGridWidth = gridWidth - 1;
		const newGrid = Array(gridHeight)
			.fill(null)
			.map(() => Array(newGridWidth).fill(null));

		const newWords = words.filter(({ word, orientation, position }) => {
			if (!position) return true;

			const fitsInGrid =
				(orientation === "horizontal" &&
					position.col + word.length <= newGridWidth) ||
				(orientation === "vertical" &&
					position.row + word.length <= gridHeight);

			if (fitsInGrid) {
				for (let i = 0; i < word.length; i++) {
					if (orientation === "horizontal") {
						newGrid[position.row][position.col + i] = word[i];
					} else {
						newGrid[position.row + i][position.col] = word[i];
					}
				}
			}

			return fitsInGrid;
		});

		manualEntries.forEach(({ row, col, value }) => {
			newGrid[row][col] = value;
		});

		setGridWidth(newGridWidth);
		setGrid(newGrid);
		setWords(newWords);
	};

	const handleIncreaseGridHeight = () => {
		const newGridHeight = gridHeight + 1;
		const newGrid = Array(newGridHeight)
			.fill(null)
			.map(() => Array(gridWidth).fill(null));

		words.forEach(({ word, orientation, position }) => {
			if (position) {
				for (let i = 0; i < word.length; i++) {
					if (orientation === "horizontal") {
						newGrid[position.row][position.col + i] = word[i];
					} else {
						newGrid[position.row + i][position.col] = word[i];
					}
				}
			}
		});

		manualEntries.forEach(({ row, col, value }) => {
			newGrid[row][col] = value;
		});

		setGridHeight(newGridHeight);
		setGrid(newGrid);
	};

	const handleDecreaseGridHeight = () => {
		if (gridHeight <= 1) return; // Prevent decreasing height below 1
		const newGridHeight = gridHeight - 1;
		const newGrid = Array(newGridHeight)
			.fill(null)
			.map(() => Array(gridWidth).fill(null));

		const newWords = words.filter(({ word, orientation, position }) => {
			if (!position) return true;

			const fitsInGrid =
				(orientation === "horizontal" &&
					position.col + word.length <= gridWidth) ||
				(orientation === "vertical" &&
					position.row + word.length <= newGridHeight);

			if (fitsInGrid) {
				for (let i = 0; i < word.length; i++) {
					if (orientation === "horizontal") {
						newGrid[position.row][position.col + i] = word[i];
					} else {
						newGrid[position.row + i][position.col] = word[i];
					}
				}
			}

			return fitsInGrid;
		});

		manualEntries.forEach(({ row, col, value }) => {
			newGrid[row][col] = value;
		});

		setGridHeight(newGridHeight);
		setGrid(newGrid);
		setWords(newWords);
	};

	const handleCellInput = (rowIndex, cellIndex, value) => {
		const newGrid = [...grid];
		newGrid[rowIndex][cellIndex] = value;

		const newManualEntries = manualEntries.filter(
			(entry) => entry.row !== rowIndex || entry.col !== cellIndex
		);
		if (value) {
			newManualEntries.push({ row: rowIndex, col: cellIndex, value });
		}

		setGrid(newGrid);
		setManualEntries(newManualEntries);
		setEditingCell(null);
	};

	const handleCellBlur = (rowIndex, cellIndex, value) => {
		handleCellInput(rowIndex, cellIndex, value);
	};

	const handleIncreaseShadedWidth = () => {
		setShadedRegion({
			...shadedRegion,
			width: Math.min(
				shadedRegion.width + 1,
				gridWidth - shadedRegion.startCol
			),
		});
	};

	const handleDecreaseShadedWidth = () => {
		setShadedRegion({
			...shadedRegion,
			width: Math.max(shadedRegion.width - 1, 1),
		});
	};

	const handleIncreaseShadedHeight = () => {
		setShadedRegion({
			...shadedRegion,
			height: Math.min(
				shadedRegion.height + 1,
				gridHeight - shadedRegion.startRow
			),
		});
	};

	const handleDecreaseShadedHeight = () => {
		setShadedRegion({
			...shadedRegion,
			height: Math.max(shadedRegion.height - 1, 1),
		});
	};

	const handleTranslateGrid = () => {
		const translatedGrid = translateGridState(grid);
		setVisualGrid(translatedGrid);
		console.log(translatedGrid);
	};

	return (
		<div className="app">
			<div className="grid-size-controls">
				<button onClick={handleIncreaseGridWidth}>Increase Grid Width</button>
				<button onClick={handleDecreaseGridWidth}>Decrease Grid Width</button>
				<button onClick={handleIncreaseGridHeight}>Increase Grid Height</button>
				<button onClick={handleDecreaseGridHeight}>Decrease Grid Height</button>
			</div>
			<div className="shaded-region-controls">
				<button onClick={handleIncreaseShadedWidth}>
					Increase Shaded Width
				</button>
				<button onClick={handleDecreaseShadedWidth}>
					Decrease Shaded Width
				</button>
				<button onClick={handleIncreaseShadedHeight}>
					Increase Shaded Height
				</button>
				<button onClick={handleDecreaseShadedHeight}>
					Decrease Shaded Height
				</button>
			</div>
			<Grid
				grid={grid}
				onCellClick={handleGridCellClick}
				onCellDoubleClick={handleGridCellDoubleClick}
				selectedWord={selectedWord}
				editingCell={editingCell}
				onCellInput={handleCellInput}
				onCellBlur={handleCellBlur}
				shadedRegion={shadedRegion}
			/>
			<div className="holding-area-container">
				<HoldingArea onAddWord={handleAddWord} />
				<div className="words-container">
					{words.map((wordObj) => (
						<Word
							key={wordObj.word}
							word={wordObj.word}
							orientation="horizontal"
							onSelectWord={() => handleSelectWord(wordObj)}
							isSelected={selectedWord && selectedWord.word === wordObj.word}
						/>
					))}
				</div>
				<button
					onClick={handleDeleteWord}
					disabled={!selectedWord}>
					Delete Selected Word
				</button>
			</div>
			<button onClick={handleTranslateGrid}>Translate Grid</button>
			<pre>{JSON.stringify(visualGrid, null, 2)}</pre>
		</div>
	);
};

export default App;
