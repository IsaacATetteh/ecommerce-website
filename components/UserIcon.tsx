"use client";

import { Session } from "next-auth";
import { FaTruck } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { FaCog } from "react-icons/fa";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserIcon = ({ user }: Session) => {
  if (user)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="w-7 h-7">
            {user.image && (
              <Image src={user.image} alt={user.name!} fill={true} />
            )}
            {!user.image && (
              <AvatarFallback className="bg-primary/25">
                <div className="font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 p-5">
          <div className="flex flex-col items-center justify-center bg-primary/25 rounded-lg py-3 gap-[2px]">
            {user.image && (
              <Image
                className="rounded-full"
                src={user.image}
                alt={user.name!}
                width={30}
                height={30}
              />
            )}
            <p className="text-md font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group gap-2 cursor-pointer transition-all duration-500">
            <FaTruck className="group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem className="group gap-2 cursor-pointer">
            <FaCog className="group-hover:rotate-90 transition-all duration-300 ease-in-out" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div>
              <p>Theme</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group gap-2 cursor-pointer focus:bg-destructive/20"
            onClick={() => signOut()}
          >
            <FaSignOutAlt className="group-hover:scale-110 transition-all duration-300 ease-in-out" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default UserIcon;
