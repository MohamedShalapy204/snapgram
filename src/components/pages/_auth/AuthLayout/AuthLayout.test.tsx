import { describe, it, expect, vi } from "vitest"
import { render, screen } from "../../../../../tests/test-utils.tsx"
import AuthLayout from "./AuthLayout.tsx"

// Mock the react-router-dom hooks to simplify layout testing
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
        Outlet: () => <div data-testid="outlet">Child Route Content</div>
    }
})

describe("AuthLayout", () => {
    // Negative Testing: Redirection when already authenticated
    it("should redirect to root path if user is already authenticated", () => {
        // Arrange
        render(<AuthLayout />, {
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { id: "1", name: "Test User", username: "test", email: "test@snap.com", avatar: "" }
                }
            }
        })

        // Assert
        const navigate = screen.getByTestId("navigate")
        expect(navigate).toHaveAttribute("data-to", "/")
        expect(screen.queryByTestId("outlet")).not.toBeInTheDocument()
    })

    // Positive Testing: Successful Rendering for Guests
    it("should render the authentication layout with outlet and image for guests", () => {
        // Arrange
        render(<AuthLayout />, {
            preloadedState: {
                auth: {
                    isAuthenticated: false,
                    user: null
                }
            }
        })

        // Assert
        expect(screen.getByTestId("outlet")).toBeInTheDocument()
        expect(screen.getByText(/Child Route Content/i)).toBeInTheDocument()
        expect(screen.getByAltText(/Authentication background/i)).toBeInTheDocument()
        expect(screen.queryByTestId("navigate")).not.toBeInTheDocument()
    })

    // Boundary/Integration: Accessibility checks
    it("should have clear semantic layout and alt text on background image", () => {
        // Arrange
        render(<AuthLayout />, {
            preloadedState: {
                auth: { isAuthenticated: false, user: null }
            }
        })

        // Assert
        const bgImg = screen.getByAltText(/Authentication background/i)
        expect(bgImg).toBeDefined()
        expect(bgImg).toHaveClass("object-cover")
    })
})
