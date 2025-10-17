
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exchangeCodeForTokens } from '@/lib/google-calendar';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', req.url));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(new URL(`/dashboard?error=${error}`, req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?error=no_code', req.url));
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/dashboard?error=user_not_found', req.url));
    }

    // Save tokens to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiresAt: new Date(tokens.expiry_date),
        googleConnected: true,
      },
    });

    return NextResponse.redirect(new URL('/practice?connected=true', req.url));
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.redirect(new URL('/dashboard?error=callback_failed', req.url));
  }
}
