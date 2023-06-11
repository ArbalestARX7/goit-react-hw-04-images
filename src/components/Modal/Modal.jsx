import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import PropTypes from 'prop-types';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

function Modal({ largeImage, closeModal }) {
  useEffect(() => {
    window.addEventListener('keydown', evt => {
      if (evt.code === 'Escape') {
        closeModal();
      }
    });

    return () => {
      window.addEventListener('keydown', evt => {
        if (evt.code === 'Escape') {
          closeModal();
        }
      });
    };
  }, [closeModal]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return createPortal(
    <div className={css.Overlay} onClick={handleBackdropClick}>
      <div className={css.Modal}>
        <img src={largeImage} alt="" />
      </div>
    </div>,
    modalRoot
  );
}

// class Modal extends Component {
//   componentDidMount() {
//     window.addEventListener('keydown', this.handleKeyDown);
//   }

//   componentWillUnmount() {
//     window.removeEventListener('keydown', this.handleKeyDown);
//   }

//   handleKeyDown = evt => {
//     if (evt.code === 'Escape') {
//       this.props.closeModal();
//     }
//   };

//   handleBackdropClick = e => {
//     if (e.target === e.currentTarget) {
//       this.props.closeModal();
//     }
//   };

//   render() {
//     return createPortal(
//       <div className={css.Overlay} onClick={this.handleBackdropClick}>
//         <div className={css.Modal}>
//           <img src={this.props.largeImage} alt="" />
//         </div>
//       </div>,
//       modalRoot
//     );
//   }
// }

export default Modal;

Modal.propTypes = {
  largeImage: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
