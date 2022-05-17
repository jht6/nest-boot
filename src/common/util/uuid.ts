import { v4 } from 'uuid';

export const getUuid = (): string => {
  return v4();
};
