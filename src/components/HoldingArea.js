// src/components/HoldingArea.js
import React, { useState } from "react";
import "./HoldingArea.css";

const HoldingArea = ({ onAddWord, onSelectWord }) => {
	const [inputWord, setInputWord] = useState("");

	const handleAddWord = () => {
		if (inputWord.trim()) {
			onAddWord(inputWord.trim().toUpperCase());
			setInputWord("");
		}
	};

	return (
		<div className="holding-area">
			<input
				type="text"
				value={inputWord}
				onChange={(e) => setInputWord(e.target.value)}
				placeholder="Enter a word"
			/>
			<button onClick={handleAddWord}>Add Word</button>
		</div>
	);
};

export default HoldingArea;
