import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../../../../tests/test-utils.tsx"
import SignUpForm from "./SignUpForm.tsx"

import { useSignUp } from "../../../../hooks/queries/useAuth"
import { useToast } from "../../../../hooks/useToast"

vi.mock("../../../../hooks/queries/useAuth", () => ({
    useSignUp: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: false
    }))
}))

vi.mock("../../../../hooks/useToast", () => ({
    useToast: vi.fn(() => ({
        toast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }))
}))
/**
 * Helper to render component within a router and redux context
 */
const renderSignUpForm = () => {
    return render(<SignUpForm />)
}

describe("SignUpForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Positive Testing: Successful Rendering
    it("should render all form fields correctly", () => {
        // Arrange
        renderSignUpForm()

        // Assert
        expect(screen.getByText(/Join our community/i)).toBeInTheDocument()
        expect(screen.getByLabelText("Name")).toBeInTheDocument()
        expect(screen.getByLabelText("Username")).toBeInTheDocument()
        expect(screen.getByLabelText("Email")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
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
        await waitFor(() => {
            expect(screen.getByText("Name is required")).toBeInTheDocument()
            expect(screen.getByText("Username is required")).toBeInTheDocument()
            expect(screen.getByText("Email is required")).toBeInTheDocument()
            expect(screen.getByText("Password is required")).toBeInTheDocument()
        })
    })

    // Boundary Testing: Username length
    it("should show error for username shorter than 3 characters", async () => {
        // Arrange
        renderSignUpForm()

        // Act
        const usernameInput = screen.getByPlaceholderText("johndoe")
        fireEvent.change(usernameInput, { target: { value: "ab" } })
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }))

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Min 3 characters")).toBeInTheDocument()
        })
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
    it("should call useSignUp mutate function on valid submission", async () => {
        // Arrange
        const mockMutateAsync = vi.fn().mockResolvedValueOnce({})
        vi.mocked(useSignUp).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false
        } as unknown as ReturnType<typeof useSignUp>)

        renderSignUpForm()

        const nameInput = screen.getByPlaceholderText(/John Doe/i)
        const usernameInput = screen.getByPlaceholderText(/johndoe/i)
        const emailInput = screen.getByPlaceholderText(/m@example.com/i)
        const passwordInput = screen.getByPlaceholderText(/••••••••/i)
        const submitButton = screen.getByRole("button", { name: /Sign Up/i })

        // Act
        fireEvent.change(nameInput, { target: { value: "Alice Jones" } })
        fireEvent.change(usernameInput, { target: { value: "alice_j" } })
        fireEvent.change(emailInput, { target: { value: "alice@snap.com" } })
        fireEvent.change(passwordInput, { target: { value: "secure-password" } })
        fireEvent.click(submitButton)

        // Assert
        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                name: "Alice Jones",
                username: "alice_j",
                email: "alice@snap.com",
                password: "secure-password",
            })
        })
    })

    // Negative Testing: Server/hook validation error
    it("should display the dynamic backend error via toast if signup fails", async () => {
        // Arrange
        const mockToastError = vi.fn()
        vi.mocked(useToast).mockReturnValue({
            toast: vi.fn(),
            success: vi.fn(),
            error: mockToastError,
            info: vi.fn(),
            warning: vi.fn()
        } as unknown as ReturnType<typeof useToast>)

        const mockMutateAsync = vi.fn().mockRejectedValueOnce(new Error("Username already taken. Please choose another one."))
        vi.mocked(useSignUp).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false
        } as unknown as ReturnType<typeof useSignUp>)

        renderSignUpForm()

        const nameInput = screen.getByPlaceholderText(/John Doe/i)
        const usernameInput = screen.getByPlaceholderText(/johndoe/i)
        const emailInput = screen.getByPlaceholderText(/m@example.com/i)
        const passwordInput = screen.getByPlaceholderText(/••••••••/i)

        // Act
        fireEvent.change(nameInput, { target: { value: "Alice Jones" } })
        fireEvent.change(usernameInput, { target: { value: "taken" } })
        fireEvent.change(emailInput, { target: { value: "alice@snap.com" } })
        fireEvent.change(passwordInput, { target: { value: "secure-password" } })
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }))

        // Assert
        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith("Username already taken. Please choose another one.")
        })
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
