import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Models } from 'appwrite';
import { createUserAccount, signInAccount, getCurrentAccount, signOutAccount, updateVerificationStatus, sendVerificationEmail, updateAccountName } from '../../services/appwrite';
import type { SignupSchema, SigninSchema } from '../../utils/validation';
import { QUERY_KEYS } from '../../keys/queryKeys';
import type { UserAccount } from '../../types';

/**
 * Custom React Query Hook for updating the user's name.
 */
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<Models.User<Models.Preferences>, Error, string>({
        mutationFn: (name: string) => updateAccountName(name),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        },
        onError: (error: Error) => {
            console.error("useUpdateUser :: error:", error);
        }
    });
};

/**
 * Custom React Query Hook for handling User Sign Up
 * It creates the account, establishes a session, and syncs the new user to the global Redux store.
 */
export const useSignUp = () => {
    const queryClient = useQueryClient();

    return useMutation<Models.User<Models.Preferences>, Error, SignupSchema>({
        mutationFn: async (data: SignupSchema) => {
            const newAccount = await createUserAccount(data);

            // Sign in immediately after creating account
            await signInAccount({ email: data.email, password: data.password });

            // Automatically send the verification email after signing in
            await sendVerificationEmail(`${window.location.origin}/verify-email`);

            return newAccount;
        },
        onSuccess: (newAccount, variables) => {
            // Update the global React Query user cache automatically
            queryClient.setQueryData<UserAccount>([QUERY_KEYS.GET_CURRENT_USER], {
                id: newAccount.$id,
                name: newAccount.name,
                username: variables.username,
                email: newAccount.email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAccount.$id}`,
                verified: false // New accounts start unverified
            });
        },
        onError: (error: Error) => {
            console.error("useSignUp :: error:", error);
            // Could add toast notification logic here later
        }
    });
};

/**
 * Custom React Query Hook for handling User Sign In
 * It establishes a session, retrieves the user's profile, and implicitly caches it in React Query without Redux.
 */
export const useSignIn = () => {
    const queryClient = useQueryClient();

    return useMutation<Models.User<Models.Preferences>, Error, SigninSchema>({
        mutationFn: async (data: SigninSchema) => {
            await signInAccount({ email: data.email, password: data.password });

            const currentAccount = await getCurrentAccount();
            if (!currentAccount) throw new Error("Could not retrieve account details");

            return currentAccount;
        },
        onSuccess: (currentAccount) => {
            queryClient.setQueryData<UserAccount>([QUERY_KEYS.GET_CURRENT_USER], {
                id: currentAccount.$id,
                name: currentAccount.name,
                username: currentAccount.name.replace(/\s+/g, '').toLowerCase(), // Temporary mock out until DB service is up
                email: currentAccount.email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAccount.$id}`,
                verified: currentAccount.emailVerification
            });
        },
        onError: (error: Error) => {
            console.error("useSignIn :: error:", error);
        }
    });
};

/**
 * Custom React Query Hook for handling User Sign Out
 */
export const useSignOut = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: signOutAccount,
        onSuccess: () => {
            // Wipe user off query client cache entirely
            queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], null);
        },
        onError: (error: Error) => {
            console.error("useSignOut :: error:", error);
        }
    });
};

/**
 * Custom React Query Hook for retrieving the authenticated user's profile.
 * Acts as the single source of truth for auth status, removing the need for Redux.
 */
export const useUser = () => {
    return useQuery<UserAccount | null, Error>({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: async () => {
            try {
                const currentAccount = await getCurrentAccount();
                if (!currentAccount) return null;

                return {
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.name.replace(/\s+/g, '').toLowerCase(), // Mocked mapping
                    email: currentAccount.email,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAccount.$id}`,
                    verified: currentAccount.emailVerification
                };
            } catch {
                // If account get fails (e.g. no session), return null instead of throwing to avoid error boundary crashes on public routes
                return null;
            }
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: false // Do not retry missing sessions
    });
};

/**
 * Custom React Query Hook for handling Email Verification
 */
export const useVerifyEmail = () => {
    const queryClient = useQueryClient();

    return useMutation<Models.Token, Error, { userId: string; secret: string }>({
        mutationFn: ({ userId, secret }: { userId: string; secret: string }) =>
            updateVerificationStatus(userId, secret),
        onSuccess: () => {
            // Invalidate user data to trigger a re-fetch with new verification status
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
        },
        onError: (error: Error) => {
            console.error("useVerifyEmail :: error:", error);
        }
    });
};

/**
 * Custom React Query Hook for sending verification email
 */
export const useSendVerificationEmail = () => {
    return useMutation<Models.Token, Error, string>({
        mutationFn: (url: string) => sendVerificationEmail(url),
        onSuccess: () => {
            console.log("Verification email sent!");
        },
        onError: (error: Error) => {
            console.error("useSendVerificationEmail :: error:", error);
        }
    });
};

