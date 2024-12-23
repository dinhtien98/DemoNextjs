import { getServerSession } from "next-auth";
import { GET } from "./api/auth/[...nextauth]/route";

interface Session {
  user?: {
    name?: string;
  };
}

export default async function Home() {
  const sessions: Session | null = await getServerSession(GET);

  return (
    <div>
      {sessions ? (
        <p>Signed in as {sessions?.user?.name}</p>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
}
