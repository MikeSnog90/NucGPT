import React, { useState } from "react";
import styles from "./Dropzone.module.css";

export default function Dropzone({ onFiles }) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
		if (onFiles) onFiles(files);
	};

	const handleInputChange = (e) => {
		const files = Array.from(e.target.files);
		if (onFiles) onFiles(files);
	};

	return (
		<div
			className={`${styles.dropzone} ${
				isDragging ? styles.dragging : ""
			}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p>Arraste arquivos aqui ou clique para selecionar</p>

			<input
				type="file"
				multiple
				className={styles.fileInput}
				onChange={handleInputChange}
			/>
		</div>
	);
}
