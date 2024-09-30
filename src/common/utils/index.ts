export function SanitizeObject<TData extends Record<string, any> = any>({
  data,
  keysToRemove = [],
}: {
  data: TData;
  keysToRemove?: string[];
}): Promise<TData> {
  return new Promise<TData>((resolve, reject) => {
    if (!(data && typeof data === 'object')) {
      resolve(data);
    }
    if (Array.isArray(data)) {
      resolve(data);
    }
    keysToRemove.forEach((element) => {
      if (data.hasOwnProperty(element)) {
        delete data[element as keyof TData];
      }
    });
    for (let property in data) {
      if (
        data[property] === null ||
        data[property] === undefined ||
        (data[property] as any) === 'undefined' ||
        (data[property] as any) === ''
      ) {
        delete data[property];
      }
    }
    resolve(data);
  });
}
