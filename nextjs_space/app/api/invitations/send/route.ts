
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

// Email sending function (mock for now - you can integrate with a service like SendGrid, Resend, etc.)
async function sendInvitationEmail(email: string, inviteCode: string, senderName?: string, message?: string) {
  // In production, integrate with email service
  // For now, we'll just log it
  console.log(`
    ====================================
    📧 INVITATION EMAIL
    ====================================
    To: ${email}
    From: ${senderName || 'SpeaklyPlan'}
    Invite Code: ${inviteCode}
    Message: ${message || 'Te invito a unirte a SpeaklyPlan'}
    Link: ${process.env.NEXTAUTH_URL}/auth/register?invite=${inviteCode}
    ====================================
  `)
  
  // TODO: Implement actual email sending
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'SpeaklyPlan <noreply@speaklyplan.com>',
  //   to: email,
  //   subject: `${senderName} te invita a SpeaklyPlan`,
  //   html: `...`
  // })
  
  return true
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    
    const { emails, message, senderEmail, senderName } = body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un email' },
        { status: 400 }
      )
    }

    if (emails.length > 10) {
      return NextResponse.json(
        { error: 'Máximo 10 invitaciones por vez' },
        { status: 400 }
      )
    }

    // Get sender info from session if available
    const finalSenderEmail = session?.user?.email || senderEmail
    const finalSenderName = session?.user?.name || senderName || 'Un amigo'

    const invitations = []
    const sentEmails: string[] = []

    for (const email of emails) {
      // Generate unique invite code
      const inviteCode = randomBytes(16).toString('hex')
      
      // Set expiration to 30 days from now
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      // Create invitation in database
      const invitation = await prisma.invitation.create({
        data: {
          senderEmail: finalSenderEmail,
          senderName: finalSenderName,
          recipientEmail: email,
          inviteCode,
          message: message || null,
          expiresAt,
          status: 'pending'
        }
      })

      // Send email
      try {
        await sendInvitationEmail(email, inviteCode, finalSenderName, message)
        sentEmails.push(email)
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error)
        // Continue with other emails even if one fails
      }

      invitations.push(invitation)
    }

    return NextResponse.json({
      success: true,
      sent: sentEmails.length,
      total: emails.length,
      invitations: invitations.map(inv => ({
        id: inv.id,
        email: inv.recipientEmail,
        code: inv.inviteCode
      }))
    })

  } catch (error) {
    console.error('Error sending invitations:', error)
    return NextResponse.json(
      { error: 'Error al enviar invitaciones' },
      { status: 500 }
    )
  }
}

// GET endpoint to check invitation status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Get invitations sent by this user
    const sentInvitations = await prisma.invitation.findMany({
      where: {
        senderEmail: session.user.email
      },
      orderBy: {
        sentAt: 'desc'
      },
      take: 50
    })

    const stats = {
      total: sentInvitations.length,
      pending: sentInvitations.filter(i => i.status === 'pending').length,
      registered: sentInvitations.filter(i => i.status === 'registered').length,
      expired: sentInvitations.filter(i => i.status === 'expired').length
    }

    return NextResponse.json({
      invitations: sentInvitations,
      stats
    })

  } catch (error) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Error al obtener invitaciones' },
      { status: 500 }
    )
  }
}
