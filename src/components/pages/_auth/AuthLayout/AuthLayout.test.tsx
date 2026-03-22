import { describe, it, expect, vi } from "vitest"
import { render, screen } from "../../../../../tests/test-utils.tsx"
import AuthLayout from "./AuthLayout.tsx"
import { useUser } from "../../../../hooks/queries/useAuth"
import type { UseQueryResult } from "@tanstack/react-query"
import type { UserAccount } from "../../../../types/index.ts"

// Mock the react-router-dom hooks to simplify layout testing
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
        Outlet: () => <div data-testid="outlet">Child Route Content</div>
    }
})

// Mock the useUser hook from useAuth module
vi.mock("../../../../hooks/queries/useAuth", async () => {
    const actual = await vi.importActual("../../../../hooks/queries/useAuth") as object
    return {
        ...actual,
        useUser: vi.fn()
    }
})

describe("AuthLayout", () => {
    // Negative Testing: Redirection when already authenticated
    it("should redirect to root path if user is already authenticated", () => {
        // Arrange
        vi.mocked(useUser).mockReturnValue({
            data: { id: "1", name: "Test User", username: "test", email: "test@snap.com", avatar: "" },
            isPending: false
        } as unknown as UseQueryResult<UserAccount | null, Error>)

        render(<AuthLayout />)

        // Assert
        const navigate = screen.getByTestId("navigate")
        expect(navigate).toHaveAttribute("data-to", "/")
        expect(screen.queryByTestId("outlet")).not.toBeInTheDocument()
    })

    it("should show loading spinner when user data is pending", () => {
        // Arrange
        vi.mocked(useUser).mockReturnValue({
            data: null,
            isPending: true
        } as unknown as UseQueryResult<UserAccount | null, Error>)

        render(<AuthLayout />)

        // Assert
        expect(screen.getByRole("status")).toBeDefined()
        expect(screen.queryByTestId("outlet")).not.toBeInTheDocument()
    })

    // Positive Testing: Successful Rendering for Guests
    it("should render the authentication layout with outlet and image for guests", () => {
        // Arrange
        vi.mocked(useUser).mockReturnValue({
            data: null,
            isPending: false
        } as unknown as UseQueryResult<UserAccount | null, Error>)

        render(<AuthLayout />)

        // Assert
        expect(screen.getByTestId("outlet")).toBeInTheDocument()
        expect(screen.getByText(/Child Route Content/i)).toBeInTheDocument()
        expect(screen.getByAltText(/Authentication background/i)).toBeInTheDocument()
        expect(screen.queryByTestId("navigate")).not.toBeInTheDocument()
    })

    // Boundary/Integration: Accessibility checks
    it("should have clear semantic layout and alt text on background image", () => {
        // Arrange
        vi.mocked(useUser).mockReturnValue({
            data: null,
            isPending: false
        } as unknown as UseQueryResult<UserAccount | null, Error>)

        render(<AuthLayout />)

        // Assert
        const bgImg = screen.getByAltText(/Authentication background/i)
        expect(bgImg).toBeDefined()
        expect(bgImg).toHaveClass("object-cover")
    })
})
