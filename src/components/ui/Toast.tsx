import React from 'react';
export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div role="status" className="toast">{message}</div>;
}
