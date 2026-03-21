import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useAppSelector } from "../../../../store/hooks.ts"

/**
 * RootLayout - Private area layout with Sidebar and Topbar.
 * Following react-ecosystem guidelines: separate layout logic from components.
 */
const RootLayout = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/signin" />
    }

    return (
        <div className="flex w-full flex-col md:flex-row min-h-screen bg-base-200 selection:bg-primary selection:text-primary-content">
            <Topbar />
            <Sidebar />

            <section className="flex flex-1 h-full py-10 px-4 md:px-10 justify-center overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl w-full">
                    <Outlet />
                </div>
            </section>
        </div>
    )
}

export default RootLayout
