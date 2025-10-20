
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OneOnOneClient } from "./_components/one-on-one-client";

export default async function OneOnOnePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <OneOnOneClient />;
}
