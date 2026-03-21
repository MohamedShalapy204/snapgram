import { useMutation } from '@tanstack/react-query';
import { createUserAccount, signInAccount } from '../../services/appwrite';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/features/authSlice';
import type { SignupSchema } from '../../utils/validation';

/**
 * Custom React Query Hook for handling User Sign Up
 * It creates the account, establishes a session, and syncs the new user to the global Redux store.
 */
export const useSignUp = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (data: SignupSchema) => {
            const newAccount = await createUserAccount(data);

            // Sign in immediately after creating account
            await signInAccount({ email: data.email, password: data.password });

            return newAccount;
        },
        onSuccess: (newAccount, variables) => {
            // Update the global client state
            dispatch(setUser({
                id: newAccount.$id,
                name: newAccount.name,
                username: variables.username,
                email: newAccount.email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAccount.$id}`
            }));
        },
        onError: (error) => {
            console.error("useSignUp :: error:", error);
            // Could add toast notification logic here later
        }
    });
};
