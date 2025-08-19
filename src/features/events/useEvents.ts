import { Api } from '../../api/client';

export const Events = {
  adopt: (suggestionId: string) => Api.postEvent({ action: 'adopt', suggestionId }),
  skip: (suggestionId: string) => Api.postEvent({ action: 'skip', suggestionId }),
  impression: (context?: Record<string, unknown>) => Api.postEvent({ action: 'impression', context }),
};
