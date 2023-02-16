import { vi, Mock } from "vitest";
import fetch from "isomorphic-unfetch";

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

  // Redirect isomorphic-unfetch to use the mocked fetch
  vi.mock("isomorphic-unfetch");
  vi.mocked(fetch).mockImplementationOnce(global.fetch);

  return mock;
}
