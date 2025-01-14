import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import TableUser from './tableUser';
import LoginPage from '../(auth)/login/page';

export default async function pageUser() {
    const session: Session | null = await getServerSession(authOptions);
    return (
        <div>
            {session ?<TableUser session={session} /> : <LoginPage/>}
        </div>
    )
}
