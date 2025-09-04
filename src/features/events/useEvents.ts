import { Api } from '../../api/client';

export const Events = {
  adopt: (suggestionId: string) => Api.postEventQuiet({ action: 'adopt', suggestionId }),
  skip: (suggestionId: string) => Api.postEventQuiet({ action: 'skip', suggestionId }),
  impression: (context?: Record<string, unknown>) => Api.postEventQuiet({ action: 'impression', context }),
};
