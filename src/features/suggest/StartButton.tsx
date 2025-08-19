import React from 'react';
import { Api } from '../../api/client';

export default function StartButton({ suggestionId }: { suggestionId: string }) {
  return (
    <button onClick={() => Api.postEvent({ action: 'adopt', suggestionId })}>
      開始
    </button>
  );
}
