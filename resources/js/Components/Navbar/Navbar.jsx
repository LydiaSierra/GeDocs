export default function Navbar() {
    return (
        <nav className="navbar bg-white shadow-sm px-4 h-20 flex justify-between items-center">

            <div className="flex-shrink-0">
                <a href="/">
                    <img src="/gedocs-logo.svg" alt="gedocs logo" className="h-10" />
                </a>
            </div>


            <div className="flex gap-2 items-center">
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost py-8 rounded-md gap-3 flex items-center"
                    >

                        <img
                            className="w-10 h-10 md:w-14 md:h-14 rounded-full"
                            alt="profile pic"
                            src="/images/girl-pic.jpg"
                        />


                        <div className="hidden sm:flex flex-col justify-end text-end">
                            <div className="font-bold text-sm md:text-lg text-black">
                                Lily Martineez
                            </div>
                            <div className="font-light text-xs md:text-sm text-gray-500 truncate max-w-[150px] md:max-w-none">
                                lily_martinez@soy.sena.edu.co
                            </div>
                        </div>
                    </div>


                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a className="justify-between">
                                Profile <span className="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
