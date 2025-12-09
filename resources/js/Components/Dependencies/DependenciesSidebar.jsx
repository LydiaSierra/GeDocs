import React from "react";

export default function DependenciesSidebar() {
    return (
        <div className="w-full">
            <h1 className="text-4xl p-2">Dependencias</h1>
            <div>
                <div className="overflow-x-auto w-300 ">
                   <div className="collapse collapse-arrow bg-base-100 border border-base-300 w-full">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">Puchamosn</div>
                    <div className="collapse-content text-sm">
                        <p>Click the "Sign Up" button in the top right corner and follow the registration process.</p>
                    </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">I forgot my password. What should I do?</div>
                    <div className="collapse-content text-sm">
                        Click on "Forgot Password" on the login page and follow the instructions sent to your email.
                    </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">How do I update my profile information?</div>
                    <div className="collapse-content text-sm">
                        Go to "My Account" settings and select "Edit Profile" to make changes.
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
}
