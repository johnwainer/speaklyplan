
import { NextRequest, NextResponse } from 'next/server'
import { downloadFile } from '@/lib/s3'

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = decodeURIComponent(params.key || '')

    if (!key) {
      return NextResponse.json({ error: 'Key no proporcionado' }, { status: 400 })
    }

    const signedUrl = await downloadFile(key)
    
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('Error getting photo:', error)
    return NextResponse.json({ error: 'Error al obtener la foto' }, { status: 500 })
  }
}
