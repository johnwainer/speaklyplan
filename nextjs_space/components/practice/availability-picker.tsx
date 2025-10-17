
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Slot {
  start: Date
  end: Date
  available: boolean
}

export function AvailabilityPicker({
  partnerId,
  onSelectSlot
}: {
  partnerId: string
  onSelectSlot: (slot: Slot) => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  useEffect(() => {
    loadAvailability()
  }, [selectedDate])

  const loadAvailability = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/practice/availability/${partnerId}?date=${selectedDate.toISOString()}`
      )
      const data = await response.json()
      
      if (data.success) {
        setSlots(data.slots.map((s: any) => ({
          ...s,
          start: new Date(s.start),
          end: new Date(s.end)
        })))
      }
    } catch (error) {
      console.error('Error cargando disponibilidad:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot)
    onSelectSlot(slot)
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        disabled={(date) => date < new Date()}
        locale={es}
        className="rounded-md border"
      />

      <div>
        <h4 className="font-medium mb-2 text-sm">
          Horarios disponibles - {format(selectedDate, 'PPPP', { locale: es })}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
            {slots.map((slot, index) => (
              <Button
                key={index}
                variant={selectedSlot === slot ? 'default' : slot.available ? 'outline' : 'ghost'}
                disabled={!slot.available}
                onClick={() => handleSlotClick(slot)}
                className="text-sm"
              >
                {format(slot.start, 'HH:mm')}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
