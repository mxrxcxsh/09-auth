'use client';

import css from './Modal.module.css';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  useRouterBack?: boolean;
}

function Modal({ children, onClose, useRouterBack = false }: ModalProps) {
  const router = useRouter();
  const modalRoot = document.getElementById('modal-root');

  const close = () => {
    if (onClose && !useRouterBack) {
      onClose();
    } else {
      router.back();
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('no-scroll');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('no-scroll');
    };
  });

  if (!modalRoot) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}

export default Modal;
