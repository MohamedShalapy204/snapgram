import { type PropsWithChildren, type ReactElement } from "react"
import { render as rtlRender, type RenderOptions } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import authReducer from "../src/store/features/authSlice.ts"
import type { RootState, AppStore } from "../src/store/store.ts"

/**
 * Combined reducer for use in tests to match the store's structure and satisfy RTK types.
 */
const rootReducer = combineReducers({
    auth: authReducer,
})

/**
 * Interface that extends the standard RTL RenderOptions with Redux-specific options.
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: Partial<RootState>
    store?: AppStore
}

/**
 * Custom render function that wraps components in necessary providers (Redux, Router).
 * Follows react-ecosystem and clean-react-code guidelines for test isolation.
 * Strictly typed without using 'any'.
 */
function render(
    ui: ReactElement,
    {
        preloadedState,
        store = configureStore({
            reducer: rootReducer,
            preloadedState,
        }),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    })

    function Wrapper({ children }: PropsWithChildren<object>): ReactElement {
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        )
    }
    return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export specific utilities from RTL to satisfy linting rules for named component exports
import { renderHook as rtlRenderHook, type RenderHookOptions } from "@testing-library/react"
export { screen, fireEvent, waitFor } from "@testing-library/react"

/**
 * Custom renderHook to match the global test providers.
 */
export function renderHook<Result, Props>(
    renderCallback: (initialProps: Props) => Result,
    {
        preloadedState,
        store = configureStore({
            reducer: rootReducer,
            preloadedState,
        }),
        ...renderOptions
    }: Omit<RenderHookOptions<Props>, "queries" | "wrapper"> & { preloadedState?: Partial<RootState>, store?: AppStore } = {}
) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    function Wrapper({ children }: PropsWithChildren<object>): ReactElement {
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        )
    }

    // As of RTL 13.1 renderHook returns { result, rerender, unmount } without store, 
    // so we re-attach store to access it manually using destructuring.
    return { store, ...rtlRenderHook(renderCallback, { wrapper: Wrapper, ...renderOptions }) }
}

// Override the RTL render with our custom one
export { render }
