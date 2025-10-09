
import { NextRequest, NextResponse } from 'next/server'
import { downloadFile } from '@/lib/s3'

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
    
    // Redirect to the signed URL
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json({ error: 'Error al obtener la imagen' }, { status: 500 })
  }
}
