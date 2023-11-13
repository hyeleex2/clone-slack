import { CSSProperties, useCallback } from "react";
import { CreateModal, CloseModalButton } from "./styles";
type Prop = {
  children: React.ReactNode;
  style?: CSSProperties;
  show: boolean;
  onCloseModal: () => void;
};

export default function Modal({ children, show, onCloseModal }: Prop) {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
}
