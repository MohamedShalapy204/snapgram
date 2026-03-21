import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../../../../tests/test-utils.tsx"
import SignUpForm from "./SignUpForm.tsx"

/**
 * Helper to render component within a router and redux context
 */
const renderSignUpForm = () => {
    return render(<SignUpForm />)
}

describe("SignUpForm", () => {
    // Positive Testing: Successful Rendering
    it("should render all form fields correctly", () => {
        // Arrange
        renderSignUpForm()

        // Assert
        expect(screen.getByText(/Join our community/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument()
    })

    // Negative Testing: Required Fields
    it("should display validation errors for required fields", async () => {
        // Arrange
        renderSignUpForm()

        // Act
        const submitButton = screen.getByRole("button", { name: /Sign Up/i })
        fireEvent.click(submitButton)

        // Assert
        expect(await screen.findByText(/Name is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/Password is required/i)).toBeInTheDocument()
    })

    // Boundary Testing: Password length
    it.each([
        { password: "1", expected: "Min 8 characters" },
        { password: "1234567", expected: "Min 8 characters" },
    ])("should show error for password '$password' below minimum length", async ({ password, expected }) => {
        // Arrange
        renderSignUpForm()

        // Act
        const passwordInput = screen.getByPlaceholderText(/••••••••/i)
        fireEvent.change(passwordInput, { target: { value: password } })
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }))

        // Assert
        expect(await screen.findByText(expected)).toBeInTheDocument()
    })

    // Positive Testing: Valid Submission
    it("should log form data on valid submission", async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, "log")
        renderSignUpForm()

        const nameInput = screen.getByPlaceholderText(/John Doe/i)
        const emailInput = screen.getByPlaceholderText(/m@example.com/i)
        const passwordInput = screen.getByPlaceholderText(/••••••••/i)
        const submitButton = screen.getByRole("button", { name: /Sign Up/i })

        // Act
        fireEvent.change(nameInput, { target: { value: "Alice Jones" } })
        fireEvent.change(emailInput, { target: { value: "alice@snap.com" } })
        fireEvent.change(passwordInput, { target: { value: "secure-password" } })
        fireEvent.click(submitButton)

        // Assert
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Demo signing up:", {
                name: "Alice Jones",
                email: "alice@snap.com",
                password: "secure-password",
            })
        })

        consoleSpy.mockRestore()
    })

    // Integration/User Perspective: Navigation Links
    it("should have a link to sign in page", () => {
        // Arrange
        renderSignUpForm()

        // Assert
        const signInLink = screen.getByRole("link", { name: /Sign In/i })
        expect(signInLink).toBeInTheDocument()
        expect(signInLink).toHaveAttribute("href", "/signin")
    })
})
