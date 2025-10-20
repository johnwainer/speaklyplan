
/**
 * Jitsi Meet utilities for SpeaklyPlan
 * Generates unique room names and meeting URLs
 */

import crypto from 'crypto';

/**
 * Generates a unique room name for Jitsi Meet
 * Format: speaklyplan-{timestamp}-{randomHash}
 */
export function generateJitsiRoomName(
  user1Id: string,
  user2Id: string,
  meetingId?: string
): string {
  const timestamp = Date.now();
  const ids = [user1Id, user2Id].sort().join('-');
  const hash = crypto
    .createHash('md5')
    .update(ids + timestamp + (meetingId || ''))
    .digest('hex')
    .substring(0, 8);

  return `speaklyplan-${timestamp}-${hash}`;
}

/**
 * Generates the full Jitsi Meet URL
 */
export function generateJitsiMeetUrl(roomName: string): string {
  return `https://meet.jit.si/${roomName}`;
}

/**
 * Validates if a room name follows our pattern
 */
export function isValidJitsiRoomName(roomName: string): boolean {
  return /^speaklyplan-\d+-[a-f0-9]{8}$/.test(roomName);
}

/**
 * Extracts room name from a Jitsi URL
 */
export function extractRoomNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const roomName = pathname.split('/').pop() || '';
    return roomName || null;
  } catch {
    return null;
  }
}
