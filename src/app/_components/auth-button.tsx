"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2 px-4 py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4 px-4 py-2">
        <div className="flex items-center space-x-2">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <UserCircleIcon className="w-8 h-8 text-gray-600" />
          )}
          <span className="text-sm font-medium">
            {session.user?.name ?? session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 px-4 py-2">
      <span className="text-sm text-gray-600">Please sign in to continue</span>
      <button
        onClick={() => signIn("discord")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Sign In with Discord
      </button>
    </div>
  );
}