import { useState } from "react";
import { useGetUsers, useSearchUsers } from "../../../../hooks/queries/useUsers";
import { type User } from "../../../../types";
import { MdSearch, MdPeople } from "react-icons/md";
import UserCard from "../../../shared/UserCard";
import useDebounce from "../../../../hooks/useDebounce";

/**
 * AllUsers component - Displays a discoverable list of users.
 * Features search functionality and premium grid layout.
 */
const AllUsers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Fetch all users or filtered users based on search
    const { data: allUsers, isLoading: isLoadingAll } = useGetUsers();
    const { data: searchedUsers, isLoading: isLoadingSearch } = useSearchUsers(debouncedSearch);

    const isLoading = debouncedSearch ? isLoadingSearch : isLoadingAll;
    const users = debouncedSearch ? (searchedUsers?.documents as unknown as User[]) : (allUsers?.documents as unknown as User[]);

    return (
        <div className="flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 custom-scrollbar">
            <div className="w-full max-w-7xl flex flex-col gap-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <MdPeople size={28} />
                        </div>
                        <div>
                            <h2 className="font-black text-3xl md:text-4xl tracking-tighter text-base-content/90">
                                All Users
                            </h2>
                            <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-1">
                                Discover and connect with the community
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors text-xl" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-base-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-base-content/30"
                        />
                    </div>
                </header>

                {/* Content Area */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={`user-skel-${i}`} className="flex flex-col items-center p-8 bg-base-100 rounded-3xl border border-base-300/50 space-y-4">
                                <div className="skeleton w-24 h-24 rounded-full ring ring-base-200"></div>
                                <div className="skeleton h-5 w-24 rounded-md"></div>
                                <div className="skeleton h-3 w-16 rounded-md"></div>
                                <div className="skeleton h-10 w-full rounded-xl mt-2"></div>
                            </div>
                        ))}
                    </div>
                ) : users && users.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {users.map((user: User) => (
                            <UserCard key={user.$id} user={user} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-10 text-center gap-6 bg-base-100 rounded-3xl border-2 border-dashed border-base-300/50">
                        <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center text-4xl opacity-50">👥</div>
                        <div className="space-y-2">
                            <h4 className="font-black text-xl">No users found</h4>
                            <p className="text-base-content/50 max-w-xs text-sm font-medium">
                                We couldn't find any users matching "{searchTerm}". Try another search term.
                            </p>
                        </div>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="btn btn-ghost btn-sm font-black text-primary underline underline-offset-4"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;
