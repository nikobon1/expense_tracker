'use client';

import { signOut, useSession } from "next-auth/react";

export default function SignOutButton() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    return (
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="sign-out-btn">
            <span className="user-email">{session.user.email}</span>
            <span className="sign-out-text">🚪 Выйти</span>
        </button>
    );
}
