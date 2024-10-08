import { auth } from "@/server/auth";
import UserIcon from "./UserIcon";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border py-8">
      <nav className="px-5">
        <ul className="flex justify-between">
          <li>
            <Link href="/">Home</Link>
          </li>
          {!session ? (
            <li>
              <Button>
                <Link href="/auth/login">
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserIcon user={session?.user} expires={session?.expires!} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
