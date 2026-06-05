import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Home, 
  Briefcase, 
  Sun, 
  FileCheck, 
  PhoneCall, 
  Calendar, 
  ShieldCheck, 
  CheckCircle, 
  Heart, 
  Layers, 
  Map, 
  MessageSquare, 
  CornerDownRight,
  Menu,
  X,
  Instagram,
  Facebook
} from 'lucide-react';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import QuoteCalculator from './components/QuoteCalculator';
import BookingForm from './components/BookingForm';
import BookingDashboard from './components/BookingDashboard';
import { Booking, ServiceType } from './types';

export default function App() {
  const [activeParams, setActiveParams] = useState<{
    serviceType: ServiceType;
    windowCount: number;
    storyCount: 1 | 2 | 3;
    hasScreens: boolean;
    hasTracks: boolean;
    hasSills: boolean;
    suburb: string;
    estimatedPrice: number;
  } | null>(null);

  // Booking states
  const [activeBookingStep, setActiveBookingStep] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [bookingTrigger, setBookingTrigger] = useState(0);
  const [localBookingCount, setLocalBookingCount] = useState(0);

  // Suburb quick verification list
  const [quickSuburbValue, setQuickSuburbValue] = useState('');
  const [quickCheckResult, setQuickCheckResult] = useState<{
    status: 'good' | 'out' | null;
    message: string;
  }>({ status: null, message: '' });

  // Load and count active bookings in local storage
  const syncBookingCount = () => {
    const saved = localStorage.getItem('azure_clarity_bookings');
    if (saved) {
      const bookings: Booking[] = JSON.parse(saved);
      const confirmed_count = bookings.filter(b => b.status === 'confirmed').length;
      setLocalBookingCount(confirmed_count);
    } else {
      setLocalBookingCount(0);
    }
  };

  useEffect(() => {
    syncBookingCount();
  }, [bookingTrigger]);

  const handleStartBooking = (params: typeof activeParams) => {
    setActiveParams(params);
    setActiveBookingStep(true);
    // Smooth scroll to the booking section
    const target = document.getElementById('detailing-form-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookingSuccess = (booking: Booking) => {
    setLatestBooking(booking);
    setActiveBookingStep(false);
    setBookingTrigger(prev => prev + 1);
  };

  const handleQuickSuburbCheck = (e: any) => {
    e.preventDefault();
    const query = quickSuburbValue.toLowerCase().trim();
    if (!query) {
      setQuickCheckResult({ status: null, message: '' });
      return;
    }

    const available_local = [
      'ringwood', 'ringwood east', 'ringwood north', 'mitcham', 'croydon', 
      'heathmont', 'box hill', 'doncaster', 'nunawading', 'melbourne cbd', 
      'richmond', 'hawthorn', 'balwyn', 'warrandyte', 'melbourne'
    ];

    if (available_local.some(s => s.includes(query) || query.includes(s))) {
      setQuickCheckResult({
        status: 'good',
        message: `✓ Yes! We serve ${quickSuburbValue || 'your area'} directly from our Ringwood hub with zero extra callout charges!`
      });
    } else {
      setQuickCheckResult({
        status: 'out',
        message: `ℹ ${quickSuburbValue} might be slightly further, but we still serve greater Melbourne. Please request pricing inside the estimator.`
      });
    }
  };

  return (
    <div className="bg-background text-on-background font-sans antialiased text-body-md min-h-screen flex flex-col">
      
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 w-full z-40 bg-black/85 backdrop-blur-md border-b border-zinc-900 shadow-[0_4px_20px_rgba(197,160,89,0.06)]">
        <div className="flex items-center justify-between px-4 md:px-10 max-w-7xl mx-auto h-20">
          <div 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-200"
          >
            <span className="p-2 bg-primary/10 rounded-xl text-primary font-bold flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse text-primary" />
            </span>
            <div>
              <h1 className="font-headline-md text-xl md:text-2xl font-bold font-serif italic text-primary tracking-tight">
                Window Cleaning Ringwood
              </h1>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400 block -mt-1 font-mono">
                Windows &amp; Solar
              </span>
            </div>
          </div>

          {/* Desktop navigations */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-zinc-300 font-sans tracking-wide">
            <a href="#services" className="hover:text-primary transition-colors">Specialised Services</a>
            <a href="#gallery" className="hover:text-primary transition-colors">Before &amp; After Proofs</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Clarity Estimator</a>
            <a href="#about" className="hover:text-primary transition-colors">About Ringwood Hub</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Local Bookings Dashboard activator button */}
            <button
              onClick={() => {
                setShowDashboard(true);
                setBookingTrigger(prev => prev + 1);
              }}
              className="relative inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-[#18181B] text-primary border border-zinc-800 hover:bg-zinc-800 transition-all font-sans"
            >
              My Bookings
              {localBookingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-605 text-[10px] text-white flex items-center justify-center font-extrabold shadow-sm animate-bounce">
                  {localBookingCount}
                </span>
              )}
            </button>

            {/* Quick Action Book Now Button */}
            <a
              href="#pricing"
              className="bg-primary text-black font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_14px_rgba(197,160,89,0.35)] flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-black" /> Book Now
            </a>
          </div>
        </div>
      </header>

      {/* Main Container Section */}
      <main className="flex-grow">
        
        {/* Dynamic Booking Success Receipt Overlay */}
        {latestBooking && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111113] rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-primary/25 text-zinc-105 transform transition-transform scale-100 p-6 md:p-8 relative">
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-950/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-900/40 shadow-md">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-headline-md text-emerald-400 font-serif italic">Booking Reserved!</h3>
                <p className="text-xs text-zinc-400 mt-1 font-medium">
                  We look forward to restoring pristine clarity to your property.
                </p>
              </div>

              {/* Booking specifications summary */}
              <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold">Booking Refer code:</span>
                  <span className="font-mono bg-primary/20 text-primary px-3 py-1 rounded-md font-extrabold text-sm">
                    {latestBooking.id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold">Scheduled Arrival Date:</span>
                  <span className="font-bold text-zinc-100">
                    {new Date(latestBooking.preferredDate).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold">Arrival Block:</span>
                  <span className="font-bold text-zinc-100 capitalize">
                    {latestBooking.preferredTimeSlot} Block
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-zinc-900 pt-2">
                  <span className="text-zinc-400 font-bold">Estimate Price:</span>
                  <span className="font-extrabold text-primary text-base">${latestBooking.estimatedPrice}</span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-[10px] text-zinc-400">
                  We have saved this reservation locally. You can reschedule or cancel it anytime via the <strong>My Bookings</strong> dash button at the top header pane.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setLatestBooking(null);
                      // Scroll to target location dashboard info
                      setShowDashboard(true);
                    }}
                    className="flex-1 bg-zinc-900 text-primary font-bold py-3.5 rounded-xl text-xs hover:bg-zinc-800 transition-colors border border-zinc-800"
                  >
                    Manage My Jobs
                  </button>
                  <button
                    onClick={() => setLatestBooking(null)}
                    className="flex-1 bg-primary text-black font-semibold py-3.5 rounded-xl text-xs hover:bg-primary/95 transition-all"
                  >
                    Back to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Local Booking Dashboard Lightbox Slide */}
        {showDashboard && (
          <div className="fixed inset-0 bg-zinc-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <BookingDashboard 
              onClose={() => {
                setShowDashboard(false);
                syncBookingCount();
              }} 
              updateTrigger={bookingTrigger}
            />
          </div>
        )}


        {/* Hero Segment */}
        <section className="relative pt-10 pb-20 md:pb-28 px-4 md:px-10 overflow-hidden bg-[#09090B]">
          <div className="absolute inset-0 z-0">
            {/* High Definition Window Cleaning Hero Graphic provided */}
            <img 
              alt="Clean architectural windows reflecting clear blue sky" 
              className="w-full h-full object-cover opacity-10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9JSwYegq281TK7M2Ju7FaZirPpibzbanc_7En62BfNA6L_xqt9li5YMKY3VvJ8EaY69577klXZLcpKbPQNoo8b4Iluyfr2kXmH3vkDCzSzRti5mkCtwLmHGGW9wT9fCTnzDKG-El893kYxat-ICcc2GVPT5JTmdxoblnerVgtOcWKM82m_8PWIrzGybWs_veY2wBIQXixIR2yyYtOQ76d-Tma9DBTjO3E_NKoMa46UoZm51LWvI5SjwwmidF3baOtuRWFVcWbSQwt"
              referrerPolicy="no-referrer"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#09090B]/80 to-[#09090B]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
            {/* Location serving active pill */}
            <div className="inline-flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20 shadow-xs">
              <MapPin className="w-4 h-4 text-primary animate-bounce" />
              <span className="font-sans text-xs font-bold text-primary">
                Serving Ringwood &amp; Greater Melbourne Area
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-headline-lg font-bold text-zinc-100 mb-6 max-w-4xl tracking-tight leading-tight font-serif italic">
              #1 Window Cleaning in <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#EAC784] to-primary">
                Ringwood &amp; Melbourne.
              </span>
            </h2>

            <p className="text-body-lg text-zinc-400 mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
              Professional window cleaners Ringwood homeowners and property managers trust. Spotless results for homes, storefronts, and solar arrays across Melbourne, bringing unobstructed views back to your life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 pb-12">
              <a
                href="#pricing"
                className="bg-primary text-black font-semibold py-4 px-8 rounded-full hover:bg-primary/95 transition-all hover:scale-[1.01] shadow-[0_8px_24px_rgba(197,160,89,0.3)] w-full sm:w-auto text-center"
              >
                Get a Free Quote
              </a>
              <a
                href="#services"
                className="bg-[#18181B] border border-zinc-800 text-zinc-300 font-semibold py-4 px-8 rounded-full hover:bg-zinc-850 transition-all hover:scale-[1.01] shadow-xs w-full sm:w-auto text-center"
              >
                View Services Checklist
              </a>
            </div>

            {/* Grid display quick links */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-6 px-2">
              <div className="glass-panel p-5 rounded-2xl bg-[#111113]/70 backdrop-blur-md border border-zinc-800/60 flex flex-col items-center text-center shadow-xs">
                <span className="p-3 bg-primary/10 text-primary rounded-xl mb-3">
                  <Home className="w-5 h-5 text-primary" />
                </span>
                <span className="font-bold text-xs text-zinc-200 block">Residential Detail</span>
                <span className="text-[10px] text-zinc-500 font-medium mt-1">Treated frames &amp; sills included</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl bg-[#111113]/70 backdrop-blur-md border border-zinc-800/60 flex flex-col items-center text-center shadow-xs">
                <span className="p-3 bg-primary/10 text-primary rounded-xl mb-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                </span>
                <span className="font-bold text-xs text-zinc-200 block">Commercial Retail</span>
                <span className="text-[10px] text-zinc-500 font-medium mt-1">Pristine storefront detailing</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl bg-[#111113]/70 backdrop-blur-md border border-zinc-800/60 flex flex-col items-center text-center shadow-xs">
                <span className="p-3 bg-primary/10 text-primary rounded-xl mb-3">
                  <Sun className="w-5 h-5 text-primary" />
                </span>
                <span className="font-bold text-xs text-zinc-200 block">Solar Clean tech</span>
                <span className="text-[10px] text-zinc-500 font-medium mt-1">Hydro-wash mineral pure flush</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl bg-[#111113]/70 backdrop-blur-md border border-zinc-800/60 flex flex-col items-center text-center shadow-xs">
                <span className="p-3 bg-primary/10 text-primary rounded-xl mb-3">
                  <FileCheck className="w-5 h-5 text-primary" />
                </span>
                <span className="font-bold text-xs text-zinc-200 block">Free Quotes</span>
                <span className="text-[10px] text-zinc-500 font-medium mt-1">Transparent instant pricing</span>
              </div>
            </div>
          </div>
        </section>


        {/* Interactive Suburb Search Checker Area */}
        <section className="py-12 bg-zinc-950 border-y border-zinc-900 text-zinc-300">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h4 className="font-headline-md text-sm font-bold text-primary uppercase tracking-widest mb-2 font-serif italic text-primary">
              SUBURB SAME-DAY COVERAGE CHECKER
            </h4>
            <p className="text-xs text-zinc-400 mb-6 font-medium">
              Find out if our mobile crews have immediate coverage for your Melbourne suburb today with zero setup travel premiums.
            </p>
            
            <form onSubmit={handleQuickSuburbCheck} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-4">
              <input
                type="text"
                placeholder="Type your suburb (e.g. Mitcham, Doncaster, CBD)"
                value={quickSuburbValue}
                onChange={e => {
                  setQuickSuburbValue(e.target.value);
                  setQuickCheckResult({ status: null, message: '' });
                }}
                className="flex-grow bg-zinc-90 w-full border border-zinc-800 text-zinc-100 rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-semibold"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-black text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Verify Area Coverage
              </button>
            </form>

            {/* Quick check verification banner output */}
            {quickCheckResult.message && (
              <div className={`inline-flex items-center gap-2 p-3 rounded-xl border text-xs font-bold animate-fade-in ${
                quickCheckResult.status === 'good'
                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/40'
                  : 'bg-amber-950/20 text-amber-400 border-amber-900/40'
              }`}>
                <span>{quickCheckResult.message}</span>
              </div>
            )}
          </div>
        </section>


        {/* Integrated interactive Gallery split results section */}
        <div className="border-b border-outline-variant/20">
          <BeforeAfterSlider />
        </div>


        {/* Specialised Services Checklist Grid */}
        <section id="services" className="py-20 px-4 md:px-10 bg-[#09090B] border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 mb-3 bg-primary/10 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest font-mono">
                Commercial &amp; Residential Scope
              </span>
              <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-zinc-100 tracking-tight mb-4 font-serif italic">
                Our Specialised Services
              </h2>
              <p className="text-body-md text-zinc-400 max-w-2xl mx-auto font-medium">
                Meticulous cleaning formulations and tools carefully tailored for Ringwood and wider Melbourne properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card item 1 */}
              <div className="p-6 bg-[#111113]/70 rounded-2xl border border-zinc-805 flex flex-col justify-between hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(197,160,89,0.06)] transition-all">
                <div>
                  <div className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
                    MOST POPULAR
                  </div>
                  <h3 className="font-headline-md text-lg font-bold text-zinc-100 mb-3">
                    Residential Windows Detail
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">
                    Comprehensive internal &amp; exterior cleaning addressing grease, bird marks, cobwebs, and stubborn mineral scale build-up.
                  </p>
                  
                  <ul className="space-y-2.5 mb-8">
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Heavy brush screen dusting included</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Streak-free water spot guarantee</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Moist frame detailing wipe down</span>
                    </li>
                  </ul>
                </div>
                <a href="#pricing" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  Instant Pricing Estimate <CornerDownRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card item 2 */}
              <div className="p-6 bg-[#111113]/70 rounded-2xl border border-zinc-805 flex flex-col justify-between hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(197,160,89,0.06)] transition-all">
                <div>
                  <div className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
                    STRATA &amp; RETAIL
                  </div>
                  <h3 className="font-headline-md text-lg font-bold text-zinc-100 mb-3">
                    Commercial Shopfronts
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">
                    Reliable recurring clean schedules for shopping centres, high-street offices, and low-rise corporate buildings. Keep business image crystal clear.
                  </p>
                  
                  <ul className="space-y-2.5 mb-8">
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Anodised metal trim buffing</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Public safety barricades during wash</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Sash edge scale breakdown scrape</span>
                    </li>
                  </ul>
                </div>
                <a href="#pricing" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  Instant Pricing Estimate <CornerDownRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card item 3 */}
              <div className="p-6 bg-[#111113]/70 rounded-2xl border border-zinc-805 flex flex-col justify-between hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(197,160,89,0.06)] transition-all">
                <div>
                  <div className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
                    MICRO POWER IMPROVE
                  </div>
                  <h3 className="font-headline-md text-lg font-bold text-zinc-100 mb-3">
                    Solar Panel Hydro-Wash
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">
                    Banish baked-on ash, pine residue, and bird droppings. Boost array photon absorption rates by up to 25% with pure wash technology.
                  </p>
                  
                  <ul className="space-y-2.5 mb-8">
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Mineral-free pure water flushing</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Gentle poly-tipped scratching brushes</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Complete frame safety inspection</span>
                    </li>
                  </ul>
                </div>
                <a href="#pricing" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  Instant Pricing Estimate <CornerDownRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* About Ringwood Service Area and detailing Section */}
        <section id="about" className="py-20 px-4 md:px-10 bg-[#0B0B0C] border-t border-zinc-900 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Context details text column */}
            <div>
              <span className="inline-block py-1 pr-3 mb-2 text-primary text-xs font-bold uppercase tracking-wider">
                Why Window Cleaning Ringwood Detailing
              </span>
              <h2 className="text-2xl md:text-3.5xl font-headline-lg font-bold text-zinc-100 tracking-tight mb-5 leading-tight font-serif italic">
                Ringwood Local Expertise, Greater Melbourne Reach
              </h2>
              
              <div className="space-y-4 text-xs font-medium text-zinc-400 leading-relaxed">
                <p>
                  Founded right in the heart of Ringwood East, we launched <strong>Window Cleaning Ringwood</strong> to combat the unique outdoor grime properties native to Victoria. From Ringwood East estates, Box Hill apartments, up to the busy shopping storefronts along Chapel Street and Melbourne CBD, our local mobile detailing crews deliver obstruction-free clarity every time.
                </p>
                <p>
                  We rely entirely on state of the art pure-water reverse osmosis systems that completely screen minerals and solid additives out. The result? Pure glass-friendly moisture that dries naturally without streaks, scale deposits, or calcium spots behind.
                </p>
              </div>

              {/* Badges indicators row */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-950/30 text-emerald-400 rounded-lg border border-emerald-900/30">
                    ✓
                  </span>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">Fully Insured Crew</span>
                    <span className="text-[10px] text-zinc-400 font-medium">Public liability coverage</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-950/30 text-emerald-400 rounded-lg border border-emerald-900/30">
                    ✓
                  </span>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">Clarity Guarantee.</span>
                    <span className="text-[10px] text-zinc-400 font-medium">Spotless check before pay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustrative Card bento stack */}
            <div className="bg-[#111113] rounded-3xl p-6 md:p-8 border border-primary/20 shadow-xl relative flex flex-col justify-between">
              <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-[10px] font-bold uppercase border border-primary/20">
                Victoria Standards
              </div>
              
              <div className="mb-6">
                <h4 className="font-headline-md text-base font-bold text-primary mb-2">Our detailing promise:</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "We treat every window pane we wash with standard safety checks, complete frame wash wipes, track brushing, and anti-static water spray, leaving long-lasting dust-repellent shields behind."
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Got questions? Call local</span>
                  <span className="text-xs font-bold text-primary block">1300 CLARITY (Ringwood)</span>
                </div>
                <div className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl whitespace-nowrap border border-primary/20">
                  Serviced Daily
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* Anchor sections for dynamic calculations */}
        <QuoteCalculator onStartBooking={handleStartBooking} />

        {/* Detailing wizard form section */}
        {activeBookingStep && activeParams && (
          <div id="detailing-form-section" className="scroll-mt-24 border-t border-outline-variant/35 animate-fade-in">
            <BookingForm 
              initialParams={{
                ...activeParams,
                hasScreens: activeParams.hasScreens,
                hasTracks: activeParams.hasTracks,
                hasSills: activeParams.hasSills
              }}
              onBack={() => {
                setActiveBookingStep(false);
                // Return smoothly to calculator viewport
                const pricingTarget = document.getElementById('pricing');
                if (pricingTarget) {
                  pricingTarget.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
        )}


        {/* Ready for a Spotless View CTA */}
        <section className="py-24 px-4 bg-primary text-on-primary relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-headline-lg font-black tracking-tight leading-tight">
              Ready for a spotless view?
            </h2>
            <p className="text-xs md:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Join hundreds of happy families and business retail shops across greater Ringwood and Melbourne enjoying brighter homes and cleaner array generation today.
            </p>
            <div>
              <a
                href="#pricing"
                className="inline-block px-8 py-4 bg-white text-primary font-bold text-xs rounded-full hover:bg-surface-container-low transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Estimate &amp; Book Your Clean Now
              </a>
              <span className="block text-[10px] text-white/60 font-semibold mt-3">
                No payment needed today • Satisfaction checklist guaranteed
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* Structured Detailed Footer */}
      <footer className="bg-[#09090B] border-t border-zinc-900 pt-16 pb-8 text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          
          {/* Col 1 Brand details */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 rounded-lg text-primary font-black text-sm">
                WCR
              </span>
              <span className="font-headline-md text-lg font-bold font-serif italic text-primary">
                Window Cleaning Ringwood
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-xs">
              Professional window detailing and pure-water solar panel cleaning serving homes and business structures across Melbourne and Ringwood area with streak-free performance.
            </p>
            
            {/* Social handles mockup */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href="#" 
                className="p-2.5 bg-zinc-900 text-primary hover:bg-primary hover:text-black border border-zinc-800 rounded-full transition-all shadow-xs"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="p-2.5 bg-zinc-900 text-primary hover:bg-primary hover:text-black border border-zinc-800 rounded-full transition-all shadow-xs"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 services links */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-zinc-200 mb-4 font-mono text-primary">
              SERVICES SCOPE
            </h4>
            <ul className="space-y-3 text-xs font-semibold text-zinc-400">
              <li><a href="#services" className="hover:text-primary transition-colors">Residential Detailing</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Commercial Glazing</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Storefront Maintenance</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Pure-Water Solar Flushing</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Gutter Detailing vacuums</a></li>
            </ul>
          </div>

          {/* Col 3 areas serviced */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-zinc-200 mb-4 font-mono text-primary">
              AREAS SERVED DAILY
            </h4>
            <ul className="space-y-3 text-xs font-semibold text-zinc-400">
              <li>Ringwood &amp; Surrounding East</li>
              <li>Box Hill &amp; Nunawading</li>
              <li>Doncaster &amp; Mitcham</li>
              <li>Croydon &amp; Heathmont</li>
              <li>Melbourne CBD &amp; Inner East</li>
            </ul>
          </div>

          {/* Col 4 contacts details */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-zinc-200 mb-4 font-mono text-primary">
              RINGWOOD OFFICE
            </h4>
            <ul className="space-y-3 text-xs font-medium text-zinc-400 leading-relaxed">
              <li>
                <span className="font-bold text-zinc-300 block">Ringwood Hub:</span>
                <span>Ringwood Hwy, Ringwood Victoria 3134</span>
              </li>
              <li>
                <span className="font-bold text-zinc-300 block">General Inquiries:</span>
                <span>support@azureclarity.com.au</span>
              </li>
              <li>
                <span className="font-bold text-zinc-300 block">Local Phone line:</span>
                <span className="font-semibold text-primary">1300 CLARITY</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright standards */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6 border-t border-zinc-900 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-zinc-500">
          <p>© 2026 Window Cleaning Ringwood. Servicing Melbourne &amp; Ringwood Eastern Suburbs.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
