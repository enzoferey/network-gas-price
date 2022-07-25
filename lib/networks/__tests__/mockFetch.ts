import { vi, Mock } from "vitest";

export function mockFetch<Value>(
  mockedReturnValue: Value,
  options: { ok?: boolean; status?: number; statusText?: string } = {}
): Mock {
  const mock = vi.fn().mockImplementation(() => {
    const { ok = true, status = 200, statusText } = options;

    return Promise.resolve({
      ok,
      status,
      statusText,
      json: () => {
        return Promise.resolve(mockedReturnValue);
      },
    });
  });

  vi.stubGlobal("fetch", mock);

  return mock;
}
