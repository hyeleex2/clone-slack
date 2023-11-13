import { CSSProperties, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "./styles";

type Prop = {
  children: React.ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: React.MouseEvent) => void;
  closeButton?: boolean;
};

export default function Menu({
  children,
  onCloseModal,
  style,
  closeButton,
  show,
}: Prop) {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && (
          <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        )}
        {children}
      </div>
    </CreateMenu>
  );
}
