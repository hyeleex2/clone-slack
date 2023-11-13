import { CSSProperties, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "./styles";

type Prop = {
  children: React.ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
};

export default function Menu({
  children,
  onCloseModal,
  style,
  closeButton,
}: Prop) {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

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
