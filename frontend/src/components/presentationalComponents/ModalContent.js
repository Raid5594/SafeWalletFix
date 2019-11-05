import React from 'react';
import ReactDOM from 'react-dom';

const ModalContent = ({closeModal, modalRef, onKeyDown, onClickAway, children}) => {
	return ReactDOM.createPortal(
		<aside className="c-modal-cover" onKeyDown={onKeyDown} onClick={onClickAway} tabIndex="0">
			<div className="c-modal-safety" ref={modalRef}>
				<button className="c-modal__close" onClick={closeModal}>
					<svg className="c-modal__close-icon" viewBox="0 0 40 40"><path d="M 10,10 L 30,30 M 30,10 L 10,30"></path></svg>
				</button>
				<div className="c-modal__body">
					{children}
				</div>
			</div>
		</aside>,
		document.body
	);
};

export default ModalContent;