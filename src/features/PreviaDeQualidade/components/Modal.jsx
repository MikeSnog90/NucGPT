// src/components/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({ open, title, onClose, children }) {
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose?.();
		if (open) window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="modal d-block"
			role="dialog"
			aria-modal="true"
			onMouseDown={onClose}
			style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
		>
			<div
				className="modal-dialog modal-dialog-centered"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{title}</h5>
						<button className="btn-close" onClick={onClose} />
					</div>
					<div className="modal-body">{children}</div>
				</div>
			</div>
		</div>
	);
}
