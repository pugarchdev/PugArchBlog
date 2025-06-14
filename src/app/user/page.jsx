// app/user/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import prisma from "@/utils/connect";
import { redirect } from "next/navigation";
import ClientDashboard from "./ClientDashboard";

/** SERVER COMPONENT (JavaScript) */
export default async function UserPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Fetch posts along with their category
  const posts = await prisma.post.findMany({
    where: { userEmail: session.user.email },
    include: { cat: true },
    orderBy: { createdAt: "desc" },
  });

  return <ClientDashboard posts={posts} userEmail={session.user.email} />;
}