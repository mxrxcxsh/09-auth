interface EmptyProps {
  message?: string;
}

export default function Empty({ message = 'No notes found' }: EmptyProps) {
  return <p>{message}</p>;
}
