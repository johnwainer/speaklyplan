
import { google } from 'googleapis';
import { prisma } from './db';

export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

export async function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export async function getAuthUrl() {
  const oauth2Client = await getOAuth2Client();
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return url;
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  const oauth2Client = await getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  
  return {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token!,
    expiry_date: tokens.expiry_date!,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  const oauth2Client = await getOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  
  return {
    access_token: credentials.access_token!,
    refresh_token: credentials.refresh_token || refreshToken,
    expiry_date: credentials.expiry_date!,
  };
}

export async function getCalendarClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiresAt: true,
      googleConnected: true,
    },
  });

  if (!user?.googleConnected || !user.googleAccessToken || !user.googleRefreshToken) {
    throw new Error('Usuario no ha conectado Google Calendar');
  }

  const oauth2Client = await getOAuth2Client();
  
  // Check if token is expired
  const now = new Date();
  const expiresAt = user.googleTokenExpiresAt ? new Date(user.googleTokenExpiresAt) : now;
  
  if (expiresAt <= now) {
    // Refresh the token
    const newTokens = await refreshAccessToken(user.googleRefreshToken);
    
    // Update in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: newTokens.access_token,
        googleRefreshToken: newTokens.refresh_token,
        googleTokenExpiresAt: new Date(newTokens.expiry_date),
      },
    });
    
    oauth2Client.setCredentials({
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
    });
  } else {
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });
  }

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export interface CreateEventParams {
  summary: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  attendeeEmail?: string;
}

export async function createCalendarEvent(
  userId: string,
  params: CreateEventParams
): Promise<{ eventId: string; meetLink: string }> {
  const calendar = await getCalendarClient(userId);

  const event = {
    summary: params.summary,
    description: params.description,
    start: {
      dateTime: params.startDateTime.toISOString(),
      timeZone: 'America/Bogota',
    },
    end: {
      dateTime: params.endDateTime.toISOString(),
      timeZone: 'America/Bogota',
    },
    attendees: params.attendeeEmail ? [{ email: params.attendeeEmail }] : [],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
  });

  return {
    eventId: response.data.id!,
    meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || '',
  };
}

export async function deleteCalendarEvent(userId: string, eventId: string): Promise<void> {
  const calendar = await getCalendarClient(userId);

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'all',
  });
}

export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  params: Partial<CreateEventParams>
): Promise<void> {
  const calendar = await getCalendarClient(userId);

  const event: any = {};

  if (params.summary) event.summary = params.summary;
  if (params.description) event.description = params.description;
  if (params.startDateTime) {
    event.start = {
      dateTime: params.startDateTime.toISOString(),
      timeZone: 'America/Bogota',
    };
  }
  if (params.endDateTime) {
    event.end = {
      dateTime: params.endDateTime.toISOString(),
      timeZone: 'America/Bogota',
    };
  }

  await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: event,
    sendUpdates: 'all',
  });
}
