import { useState } from "react";
import { useGetUsers, useSearchUsers } from "../../../../hooks/queries/useUsers";
import { type User } from "../../../../types";
import { RiSearchLine, RiUserLine, RiCloseLine, RiUserFollowLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useDebounce from "../../../../hooks/useDebounce";

/**
 * UserCard - Cinematic Aperture styled user card.
 */
const UserCard = ({ user }: { user: User }) => (
    <div className="relative group flex flex-col items-center p-6 rounded-3xl bg-surface-container border border-white/5 hover:border-primary/20 hover:bg-surface-bright/20 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:shadow-primary/10 overflow-hidden">
        {/* Ambient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />

        {/* Avatar with gradient ring */}
        <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-primary via-secondary to-primary/50 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full border-4 border-surface-container overflow-hidden">
                    <img
                        src={user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.$id}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            {/* Online dot */}
            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-surface-container" />
        </div>

        {/* User info */}
        <div className="text-center space-y-1 w-full px-2 relative z-10">
            <h3 className="font-headline font-bold text-base text-on-surface truncate group-hover:text-primary transition-colors duration-300">
                {user.name}
            </h3>
            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] truncate italic">
                @{user.username}
            </p>
            {user.bio && (
                <p className="text-xs text-on-surface-variant/60 line-clamp-2 leading-relaxed font-body mt-1.5 italic">
                    {user.bio}
                </p>
            )}
        </div>

        {/* CTA */}
        <Link
            to={`/profile/${user.$id}`}
            className="relative z-10 mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl sunset-gradient text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all hover:shadow-primary/40"
        >
            <RiUserFollowLine className="text-sm" />
            View Profile
        </Link>
    </div>
);

/**
 * AllUsers - Discover and search the Snapgram community.
 * Cinematic Aperture design system.
 */
const AllUsers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data: allUsers, isLoading: isLoadingAll } = useGetUsers();
    const { data: searchedUsers, isLoading: isLoadingSearch } = useSearchUsers(debouncedSearch);

    const isLoading = debouncedSearch ? isLoadingSearch : isLoadingAll;
    const users = (debouncedSearch
        ? (searchedUsers?.documents as unknown as User[])
        : (allUsers?.documents as unknown as User[])
    ) ?? [];

    return (
        <div className="flex flex-col flex-1 gap-10 animate-in fade-in duration-700">

            {/* ── Page Header ─────────────────────────────────── */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl sunset-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 text-xl">
                        <RiUserLine />
                    </div>
                    <div>
                        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
                            The <span className="electric-gradient-text italic">Community</span>
                        </h1>
                        <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mt-1 italic">
                            {isLoading ? "Loading..." : `${users.length} creators`}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 rounded-2xl py-3 pl-10 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            <RiCloseLine className="text-base" />
                        </button>
                    )}
                </div>
            </header>

            {/* ── Content ─────────────────────────────────────── */}
            {isLoading ? (
                /* Skeleton Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center p-6 rounded-3xl bg-surface-container border border-white/5 space-y-4 animate-pulse">
                            <div className="skeleton w-20 h-20 rounded-full" />
                            <div className="w-full space-y-2">
                                <div className="skeleton h-3.5 w-3/4 mx-auto rounded-md" />
                                <div className="skeleton h-2.5 w-1/2 mx-auto rounded-md" />
                                <div className="skeleton h-2 w-full rounded-md mt-1" />
                                <div className="skeleton h-2 w-5/6 mx-auto rounded-md" />
                            </div>
                            <div className="skeleton h-9 w-full rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : users.length > 0 ? (
                <>
                    {/* Active search label */}
                    {debouncedSearch && (
                        <p className="text-xs text-on-surface-variant italic -mt-5">
                            Showing results for <span className="text-primary font-bold">"{debouncedSearch}"</span>
                        </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {users.map((user: User) => (
                            <UserCard key={user.$id} user={user} />
                        ))}
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-40 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-3xl glass-panel border border-white/10 flex items-center justify-center text-on-surface-variant/30 text-5xl shadow-3xl">
                            <RiUserLine />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-headline text-2xl font-bold text-on-surface">No creators found</h3>
                        <p className="text-sm text-on-surface-variant italic opacity-60 max-w-xs mx-auto">
                            {searchTerm
                                ? `The aperture found no results for "${searchTerm}". Try a different name.`
                                : "No users in the community yet."}
                        </p>
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-2.5 rounded-2xl glass-panel border border-white/10 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllUsers;
