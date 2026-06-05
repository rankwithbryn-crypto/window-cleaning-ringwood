import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Calendar, Trash2, Clock, MapPin, CheckCircle, Tag, AlertTriangle, AlertCircle } from 'lucide-react';

interface BookingDashboardProps {
  onClose: () => void;
  updateTrigger: number;
}

export default function BookingDashboard({ onClose, updateTrigger }: BookingDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  // Load from LocalStorage
  const loadBookings = () => {
    const saved = localStorage.getItem('azure_clarity_bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [updateTrigger]);

  const handleCancel = (id: string) => {
    if (window.confirm('Do you really want to cancel this window cleaning appointment?')) {
      const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      localStorage.setItem('azure_clarity_bookings', JSON.stringify(updated));
      setBookings(updated);
    }
  };

  const handleReschedule = (id: string, date: string) => {
    if (!date) return;
    const updated = bookings.map(b => b.id === id ? { ...b, preferredDate: date } : b);
    localStorage.setItem('azure_clarity_bookings', JSON.stringify(updated));
    setBookings(updated);
    setReschedulingId(null);
    setNewDate('');
  };

  return (
    <div className="bg-[#111113] rounded-3xl p-6 md:p-8 max-w-4xl w-full border border-primary/25 shadow-2xl text-zinc-300">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-headline-md text-zinc-100 font-serif italic">Your Spotless Check Appointments</h2>
          <p className="text-xs text-zinc-400">Manage your window and solar cleaning reservations locally.</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-zinc-900 hover:bg-primary text-zinc-300 hover:text-black text-xs font-bold rounded-full transition-all border border-zinc-800"
        >
          Close Panel ✕
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 px-6 bg-[#09090B]/40 rounded-2xl border border-dashed border-zinc-800">
          <Calendar className="w-12 h-12 text-primary/40 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-zinc-200">No Bookings Found</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
            You currently do not have any scheduled appointments. Select details in the calculator above and click book now to schedule your first treat.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`border rounded-2xl p-5 transition-all ${
                booking.status === 'cancelled'
                  ? 'bg-zinc-950/60 border-zinc-900/80 opacity-60'
                  : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/50 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-905 pb-3 mb-3">
                <div>
                  <span className="font-mono text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-md mr-2">
                    {booking.id}
                  </span>
                  <span className="text-xs text-zinc-300 font-bold">
                    For {booking.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-950/50 text-emerald-400'
                        : booking.status === 'cancelled'
                        ? 'bg-zinc-800 text-zinc-500'
                        : 'bg-amber-950/50 text-amber-400'
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-xs font-bold text-primary">${booking.estimatedPrice}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-zinc-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Date: <strong className="text-zinc-100">{new Date(booking.preferredDate).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="capitalize">
                    Slot: <strong className="text-zinc-100">{booking.preferredTimeSlot} Block</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Suburb: <strong className="text-zinc-100">{booking.suburb}</strong>
                  </span>
                </div>
              </div>

              {/* Addon details check */}
              <div className="flex flex-wrap gap-2 mb-4 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-850 text-[10px] font-bold text-zinc-400">
                <span className="capitalize text-primary">✓ {booking.serviceType} Package</span>
                <span>• {booking.windowCount} items/volumes</span>
                {booking.hasScreens && <span>• Screen Detox Included</span>}
                {booking.hasTracks && <span>• Detail track vacuum</span>}
                {booking.hasSills && <span>• Frame &amp; Sill brush</span>}
              </div>

              {/* Action operations in Dashboard */}
              {booking.status === 'confirmed' && (
                <div className="flex flex-wrap items-center gap-2 border-t border-zinc-905 pt-3">
                  {reschedulingId === booking.id ? (
                    <div className="flex items-center gap-2 w-full animate-fade-in bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="text-xs font-bold border border-zinc-800 bg-[#161619] text-zinc-100 rounded-lg p-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                      />
                      <button
                        onClick={() => handleReschedule(booking.id, newDate)}
                        className="bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90"
                      >
                        Save New Date
                      </button>
                      <button
                        onClick={() => setReschedulingId(null)}
                        className="text-xs font-bold text-zinc-400 px-2.5 py-1.5 hover:bg-zinc-800 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setReschedulingId(booking.id)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-primary border border-zinc-800 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Reschedule Appointment
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-rose-400 bg-rose-950/20 hover:bg-rose-950/30 border border-rose-900/30 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Cancel Job
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
