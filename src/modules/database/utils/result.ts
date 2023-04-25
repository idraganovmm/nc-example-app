export const first = <T>([record]: T[]) => record;

type CountResult = Array<{ count?: string | number }>;

export const parseCount = ([{ count }]: CountResult): number =>
  typeof count === 'string' ? parseInt(count) : (count as number);
