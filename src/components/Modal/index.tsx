type Prop = {
  children: React.ReactNode;
  style?: any;
};

export default function Modal({ children }: Prop) {
  return (
    <div>
      <div>모달</div>
      {children}
    </div>
  );
}
