"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar(){
    const session = authClient.useSession();
    const router = useRouter();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <h1>MovieShop</h1>
            </div>
            <div className="flex gap-1">
                <p>{session.data?.user.name}</p>
                {session.data === null ? (
                    <>
                    <Button asChild>
                        <Link href={"/signup"}>SignUp</Link>
                    </Button>
                    <Button asChild>
                        <Link href={"/signin"}>SignIn</Link>
                    </Button>
                    </>) : 
                    (<>
                    <Button onClick={async () =>{
                        await authClient.signOut();
                        router.refresh();
                    }}>
                        Sign Out
                    </Button>
                    </>)}
            </div>
        </div>
    )
}