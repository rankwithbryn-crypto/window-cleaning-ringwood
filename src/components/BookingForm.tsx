import { useState, useMemo } from 'react';
import { Booking, ServiceType } from '../types';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, ArrowLeft, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface BookingFormProps {
  initialParams: {
    serviceType: ServiceType;
    windowCount: number;
    storyCount: 1 | 2 | 3;
    hasScreens: boolean;
    hasTracks: boolean;
    hasSills: boolean;
    suburb: string;
    estimatedPrice: number;
  };
  onBack: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export default function BookingForm({ initialParams, onBack, onBookingSuccess }: BookingFormProps) {
  // Calendar scheduling parameters
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon'>('morning');

  // Personal identifiers
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate lists of candidate dates for the next 14 days (excluding Sundays)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      // Skip Sundays (non-working day)
      if (nextDate.getDay() !== 0) {
        const dateStr = nextDate.toISOString().split('T')[0];
        const label = nextDate.toLocaleDateString('en-AU', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        dates.push({ dateStr, label });
      }
    }
    return dates;
  }, []);

  // Pre-fill next available date automatically
  if (!selectedDate && availableDates.length > 0) {
    setSelectedDate(availableDates[0].dateStr);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill out all the contact information field inputs!');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const bookingId = 'AZ-' + Math.floor(10000 + Math.random() * 90000);
      const newBooking: Booking = {
        id: bookingId,
        customerName,
        customerEmail,
        customerPhone,
        suburb: initialParams.suburb,
        serviceType: initialParams.serviceType,
        storyCount: initialParams.storyCount,
        windowCount: initialParams.windowCount,
        hasScreens: initialParams.hasScreens,
        hasTracks: initialParams.hasTracks,
        hasSills: initialParams.hasSills,
        preferredDate: selectedDate,
        preferredTimeSlot: selectedTimeSlot,
        estimatedPrice: initialParams.estimatedPrice,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        notes: notes.trim()
      };

      // Read existing bookings from localStorage
      const saved = localStorage.getItem('azure_clarity_bookings');
      const existing: Booking[] = saved ? JSON.parse(saved) : [];
      existing.push(newBooking);
      localStorage.setItem('azure_clarity_bookings', JSON.stringify(existing));

      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    }, 900);
  };

  return (
    <div className="bg-[#09090B] py-12 px-4 md:px-10 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto bg-[#111113] rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
        
        {/* Progress Header */}
        <div className="bg-primary p-6 md:p-8 text-black relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full pointer-events-none" />
          <button 
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-black/80 hover:text-black text-xs font-bold mb-4 bg-black/10 hover:bg-black/20 px-3 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-black" /> Back to Estimator
          </button>
          
          <h2 className="text-xl md:text-2xl font-headline-md font-bold mb-2 flex items-center gap-2 text-black">
            <Sparkles className="w-5 h-5 text-black animate-pulse" /> Complete Your Booking
          </h2>
          <p className="text-black/85 text-xs">
            Confirm your schedule selection and submit contact credentials for your standard appointment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 bg-[#111113]">
          
          {/* Summary Banner */}
          <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800 grid grid-cols-2 gap-4 text-xs font-medium text-zinc-300">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-1">SERVICE CALCULATE</span>
              <span className="capitalize font-bold text-primary block">
                {initialParams.serviceType === 'solar' ? 'Solar Panel Care' : initialParams.serviceType === 'gutter' ? 'Gutter Detailing' : `${initialParams.serviceType} Window Cleaning`}
              </span>
              <span className="text-zinc-400">{initialParams.windowCount} items • {initialParams.storyCount} Levels</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-1">TOTAL VALUATION</span>
              <span className="text-xl font-bold text-primary block">${initialParams.estimatedPrice}</span>
              <span className="text-[10px] text-emerald-400 font-bold block">✓ Pay on completion</span>
            </div>
          </div>

          {/* Section 1: Choose Date & Time */}
          <div className="space-y-4">
            <h3 className="font-headline-md text-sm font-bold text-on-background flex items-center gap-2 border-b border-zinc-800 pb-2">
              <CalendarIcon className="w-4.5 h-4.5 text-primary" />
              1. Date &amp; Preferred Window Time Slot
            </h3>

            {/* Date selection horizontal grid of pills */}
            <div>
              <span className="block text-xs font-semibold text-zinc-400 mb-2">Available Scheduling Dates:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 scroll-bar max-h-40 overflow-y-auto">
                {availableDates.map((item) => (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`py-2 px-3.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      selectedDate === item.dateStr
                        ? 'border-primary bg-primary text-black shadow-md'
                        : 'border-zinc-800 bg-[#161619] text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot choice */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedTimeSlot('morning')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-left transition-all ${
                  selectedTimeSlot === 'morning'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-zinc-800 bg-[#161619]/60 text-zinc-400 hover:bg-zinc-800/80'
                }`}
              >
                <Clock className="w-5 h-5 text-primary" />
                <div className="text-center">
                  <span className="text-xs font-bold block">Morning Block</span>
                  <span className="text-[10px] opacity-75">8:00 AM – 12:00 PM Arrival</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTimeSlot('afternoon')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-left transition-all ${
                  selectedTimeSlot === 'afternoon'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-zinc-800 bg-[#161619]/60 text-zinc-400 hover:bg-zinc-800/80'
                }`}
              >
                <Clock className="w-5 h-5 text-primary" />
                <div className="text-center">
                  <span className="text-xs font-bold block">Afternoon Block</span>
                  <span className="text-[10px] opacity-75">1:00 PM – 5:00 PM Arrival</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-headline-md text-sm font-bold text-on-background flex items-center gap-2 border-b border-zinc-800 pb-2">
              <User className="w-4.5 h-4.5 text-primary" />
              2. Customer Detailing Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Full Name *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your first & last name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium text-zinc-100 placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Phone Number *</label>
                <div className="relative font-mono">
                  <span className="absolute left-3.5 top-3.5 text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 0412 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium text-zinc-100 placeholder-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Email Address *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="e.g., alex@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Special Instructions / Job Notes (Optional)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-zinc-500">
                  <FileText className="w-4 h-4" />
                </span>
                <textarea
                  placeholder="Tell us about difficult window access points, gate codes, pet alerts..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium resize-none text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* Complete Submission button */}
          <div className="border-t border-zinc-800 pt-6">
            <div className="flex items-center gap-2 mb-4 bg-primary/10 p-3 rounded-xl border border-primary/20">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed">
                <strong>Clarity Assurance Guarantee:</strong> Standard local scheduling guarantees immediate spot checks, and clean frame wipe-downs. You pay only after the job finishes and has been approved.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/95 disabled:bg-primary/50 transition-colors shadow-lg hover:scale-[1.01] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Generating Booking Confirmation...</span>
              ) : (
                <>
                  <Check className="w-5 h-5 text-black" />
                  <span>Submit My Detailing Reservation</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
