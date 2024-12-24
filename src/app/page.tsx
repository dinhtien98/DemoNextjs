import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

interface Session {
  user?: {
    fullName?: string;
  };
}

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <div>
      {session ? (
        <p>Signed in as {session.user?.fullName}</p>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
}
