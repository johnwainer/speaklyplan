
import { NextRequest, NextResponse } from 'next/server'
import { downloadFile } from '@/lib/s3'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = decodeURIComponent(params.key)
    
    if (!key) {
      return NextResponse.json({ error: 'No se proporcionó clave de imagen' }, { status: 400 })
    }

    // Generate signed URL
    const signedUrl = await downloadFile(key)
    
    // Redirect to the signed URL with no-cache headers
    return NextResponse.redirect(signedUrl, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json({ error: 'Error al obtener la imagen' }, { status: 500 })
  }
}
