import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that require authentication and those for authentication pages
const privatePaths = ['/page', '/user', '/'];
const authPaths = ['/login', '/register'];

// Middleware function to handle authentication and redirection
export function middleware(request: NextRequest) {
    // const { pathname } = request.nextUrl;
    // const sessionToken = request.cookies.get('sessionToken')?.value;

    // // If the current path is already an authPath, do not redirect again
    // if (authPaths.some(path => pathname.startsWith(path))) {
    //     return NextResponse.next();
    // }

    // // Redirect unauthenticated users accessing private paths to login page
    // if (privatePaths.some(path => pathname.startsWith(path)) && !sessionToken) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }

    // // Redirect authenticated users trying to access authentication pages to the homepage
    // if (authPaths.some(path => pathname.startsWith(path)) && sessionToken) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    // Allow the request to proceed if no redirection is needed
    return NextResponse.next();
}

// Configure the middleware to match specified paths
export const config = {
    matcher: [...privatePaths, ...authPaths],
};
