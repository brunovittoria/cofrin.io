import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render as rtlRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import userEvent from "@testing-library/user-event";

export * from "@testing-library/react";
export { userEvent };

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const render = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
};
