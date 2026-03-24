import { Link } from "react-router-dom";
import { type User } from "../../types";

/**
 * UserCard component - Displays a compact profile summary.
 * Reusable across search, all-users, and follow-suggestions.
 */
const UserCard = ({ user }: { user: User }) => {
    return (
        <div className="flex flex-col items-center p-8 bg-base-100 rounded-3xl border border-base-300/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

            <div className="avatar mb-5">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 group-hover:ring-offset-2 transition-all duration-500 overflow-hidden shadow-xl">
                    <img
                        src={user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.$id}`}
                        alt={user.name}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            <div className="text-center space-y-1 relative z-10 w-full px-2">
                <h3 className="font-black text-lg tracking-tight truncate text-base-content/90 group-hover:text-primary transition-colors">
                    {user.name}
                </h3>
                <p className="text-[11px] font-bold text-primary/60 uppercase tracking-widest truncate">
                    @{user.username}
                </p>
            </div>

            <Link
                to={`/profile/${user.$id}`}
                className="btn btn-primary btn-sm w-full mt-6 rounded-xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest border-none"
            >
                View Profile
            </Link>
        </div>
    );
};

export default UserCard;
