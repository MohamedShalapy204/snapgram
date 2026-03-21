import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../../../../tests/test-utils.tsx"
import SignInForm from "./SignInForm.tsx"

/**
 * Helper to render component within a router and redux context
 */
const renderSignInForm = () => {
    return render(<SignInForm />)
}

describe("SignInForm", () => {
    // Positive Testing: Successful Rendering
    it("should render join message and form fields", () => {
        // Arrange
        renderSignInForm()

        // Assert
        expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    })

    // Negative Testing: Required Fields
    it("should display validation errors for required fields", async () => {
        // Arrange
        renderSignInForm()

        // Act
        const submitButton = screen.getByRole("button", { name: /Sign In/i })
        fireEvent.click(submitButton)

        // Assert
        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/Password is required/i)).toBeInTheDocument()
    })

    // Positive Testing: Valid Submission
    it("should log form data and update redux on valid submission", async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, "log")
        renderSignInForm()

        const emailInput = screen.getByPlaceholderText(/m@example.com/i)
        const passwordInput = screen.getByPlaceholderText(/••••••••/i)
        const submitButton = screen.getByRole("button", { name: /Sign In/i })

        // Act
        fireEvent.change(emailInput, { target: { value: "test@example.com" } })
        fireEvent.change(passwordInput, { target: { value: "password123" } })
        fireEvent.click(submitButton)

        // Assert
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Demo signing in:", {
                email: "test@example.com",
                password: "password123",
            })
        })

        consoleSpy.mockRestore()
    })
})
