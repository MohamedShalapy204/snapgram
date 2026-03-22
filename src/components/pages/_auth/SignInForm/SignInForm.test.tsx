import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../../../../tests/test-utils.tsx"
import SignInForm from "./SignInForm.tsx"
import { useSignIn } from "../../../../hooks/queries/useAuth"

vi.mock("../../../../hooks/queries/useAuth", () => ({
    useSignIn: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: false
    }))
}))

vi.mock("../../../../hooks/useToast", () => ({
    useToast: vi.fn(() => ({
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }))
}))

/**
 * Helper to render component within a router and redux context
 */
const renderSignInForm = () => {
    return render(<SignInForm />)
}

describe("SignInForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
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
    it("should call useSignIn mutate function on valid submission", async () => {
        // Arrange
        const mockMutateAsync = vi.fn().mockResolvedValueOnce({})
        vi.mocked(useSignIn).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false
        } as unknown as ReturnType<typeof useSignIn>)

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
            expect(mockMutateAsync).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            })
        })
    })
})
