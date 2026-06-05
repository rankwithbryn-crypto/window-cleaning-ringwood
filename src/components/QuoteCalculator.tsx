import { useState, useMemo } from 'react';
import { SuburbAvailability, ServiceType } from '../types';
import { Calculator, Check, AlertCircle, Info, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

const COMMON_SUBURBS: SuburbAvailability[] = [
  { name: 'Ringwood', available: true, region: 'Eastern Suburbs (Base Hub)', estimatedTravelFee: 0 },
  { name: 'Ringwood East', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 0 },
  { name: 'Ringwood North', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 0 },
  { name: 'Mitcham', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 0 },
  { name: 'Croydon', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 0 },
  { name: 'Heathmont', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 0 },
  { name: 'Box Hill', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 15 },
  { name: 'Doncaster', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 15 },
  { name: 'Nunawading', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 10 },
  { name: 'Melbourne CBD', available: true, region: 'Central Melbourne', estimatedTravelFee: 25 },
  { name: 'Richmond', available: true, region: 'Inner East', estimatedTravelFee: 20 },
  { name: 'Hawthorn', available: true, region: 'Inner East', estimatedTravelFee: 20 },
  { name: 'Geelong', available: false, region: 'Greater Victoria', estimatedTravelFee: 99 },
  { name: 'Balwyn', available: true, region: 'Eastern Suburbs', estimatedTravelFee: 15 },
  { name: 'Warrandyte', available: true, region: 'North East Outskirts', estimatedTravelFee: 20 },
];

interface QuoteCalculatorProps {
  onStartBooking: (params: {
    serviceType: ServiceType;
    windowCount: number;
    storyCount: 1 | 2 | 3;
    hasScreens: boolean;
    hasTracks: boolean;
    hasSills: boolean;
    suburb: string;
    estimatedPrice: number;
  }) => void;
}

export default function QuoteCalculator({ onStartBooking }: QuoteCalculatorProps) {
  const [serviceType, setServiceType] = useState<ServiceType>('residential');
  const [suburbSearch, setSuburbSearch] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbAvailability | null>(null);
  
  // Sizing inputs
  const [windowCount, setWindowCount] = useState<number>(12);
  const [solarPanelCount, setSolarPanelCount] = useState<number>(8);
  const [gutterLength, setGutterLength] = useState<number>(15); // meters
  const [storyCount, setStoryCount] = useState<1 | 2 | 3>(1);

  // Detail components checklist
  const [hasScreens, setHasScreens] = useState(true);
  const [hasTracks, setHasTracks] = useState(true);
  const [hasSills, setHasSills] = useState(true);

  // Suburb search list filtering
  const filteredSuburbs = useMemo(() => {
    if (!suburbSearch.trim()) return [];
    return COMMON_SUBURBS.filter(s => 
      s.name.toLowerCase().includes(suburbSearch.toLowerCase())
    );
  }, [suburbSearch]);

  const handleSelectSuburb = (suburb: SuburbAvailability) => {
    setSelectedSuburb(suburb);
    setSuburbSearch(suburb.name);
  };

  // Pricing Logic (Realistic estimation)
  const calculation = useMemo(() => {
    let basePrice = 0;
    const travelFee = selectedSuburb && selectedSuburb.available ? selectedSuburb.estimatedTravelFee : 0;
    const safetyMultiplier = storyCount === 1 ? 1.0 : storyCount === 2 ? 1.35 : 1.65;
    
    const details = [];

    if (serviceType === 'residential') {
      // $12 per window base
      const perWindow = 12;
      basePrice = windowCount * perWindow;
      details.push({ label: `${windowCount} Windows Clear Wash`, price: basePrice });

      if (hasScreens) {
        const screensPrice = windowCount * 3.5;
        basePrice += screensPrice;
        details.push({ label: `Brush & Wash ${windowCount} Screens`, price: screensPrice });
      }
      if (hasTracks) {
        const tracksPrice = windowCount * 2.5;
        basePrice += tracksPrice;
        details.push({ label: `Detail vacuum ${windowCount} Sashes & Tracks`, price: tracksPrice });
      }
      if (hasSills) {
        const sillsPrice = windowCount * 1.5;
        basePrice += sillsPrice;
        details.push({ label: `Sill wipe and frame deep scrub`, price: sillsPrice });
      }
    } else if (serviceType === 'commercial') {
      // $15 per shopfront pane (Commercial calls for thick glass cleaning & detail poles)
      const perPane = 16;
      basePrice = windowCount * perPane;
      details.push({ label: `${windowCount} Commercial Shopfront Panels`, price: basePrice });
      
      if (hasSills) {
        const sillsPrice = windowCount * 3.0; // hand polish anodized frames
        basePrice += sillsPrice;
        details.push({ label: `Anodized Frame Deep-Scrub`, price: sillsPrice });
      }
    } else if (serviceType === 'solar') {
      // $15 per panel first 5, then $9 each
      let solarPrice = 0;
      if (solarPanelCount <= 5) {
        solarPrice = solarPanelCount * 15;
      } else {
        solarPrice = (5 * 15) + ((solarPanelCount - 5) * 9);
      }
      basePrice = solarPrice;
      details.push({ label: `${solarPanelCount} Solar Panel Hydro-Wash`, price: basePrice });
    } else if (serviceType === 'gutter') {
      // Gutter vacuuming starts with $90 setup, then $6 per meter
      const setup = 95;
      const lengthFee = gutterLength * 6.5;
      basePrice = setup + lengthFee;
      details.push({ label: 'System Setup & Multi-point check', price: setup });
      details.push({ label: `${gutterLength} meters detailing gutter wash`, price: lengthFee });
    }

    // Apply safety multipliers for height (double levels require special harnesses/extension poles)
    const rawTotalBeforeTravel = basePrice * safetyMultiplier;
    const safetyAdjustFee = rawTotalBeforeTravel - basePrice;
    if (safetyAdjustFee > 0) {
      details.push({ label: `${storyCount}-Storey Site Height Prep / Ladders`, price: safetyAdjustFee });
    }

    if (travelFee > 0) {
      details.push({ label: `Melbourne Regional Transit Fee`, price: travelFee });
    }

    const total = rawTotalBeforeTravel + travelFee;

    return {
      items: details,
      subtotal: rawTotalBeforeTravel,
      travelFee,
      total: Math.round(total)
    };
  }, [serviceType, windowCount, solarPanelCount, gutterLength, storyCount, hasScreens, hasTracks, hasSills, selectedSuburb]);

  return (
    <section id="pricing" className="py-20 px-4 md:px-10 bg-[#09090B] border-t border-zinc-900 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-primary/20">
            <Calculator className="w-3.5 h-3.5" /> Instant Pricing Engine
          </div>
          <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-background mb-4 font-serif italic">
            Custom Clean Estimator
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
            Zero guess work. Select your requirements below to calculate an honest, transparent estimate instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-zinc-950/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-zinc-805">
            
            {/* Step 1: Suburb Validation */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-on-surface mb-3">
                1. Where is the property located?
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your Melbourne suburb (e.g., Ringwood, Box Hill...)"
                  value={suburbSearch}
                  onChange={(e) => {
                    setSuburbSearch(e.target.value);
                    if (selectedSuburb && selectedSuburb.name !== e.target.value) {
                      setSelectedSuburb(null);
                    }
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-zinc-100 placeholder-zinc-500"
                />
                
                {/* Available suburbs autocompletion dropdown */}
                {filteredSuburbs.length > 0 && !selectedSuburb && (
                  <div className="absolute left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-30 max-h-52 overflow-y-auto">
                    {filteredSuburbs.map((suburb) => (
                      <button
                        key={suburb.name}
                        onClick={() => handleSelectSuburb(suburb)}
                        className={`w-full text-left px-4 py-3 text-xs hover:bg-zinc-800/80 flex items-center justify-between border-b border-zinc-800 last:border-0`}
                      >
                        <div>
                          <span className="font-semibold text-zinc-100">{suburb.name}</span>
                          <span className="text-zinc-400 ml-2">({suburb.region})</span>
                        </div>
                        {suburb.available ? (
                          <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded-full uppercase">
                            Available {suburb.estimatedTravelFee === 0 ? '• Free Travel' : `• +$${suburb.estimatedTravelFee} trans`}
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold text-[10px] bg-rose-950/40 px-2 py-0.5 rounded-full uppercase">
                            Out of range
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selection Status Alerts */}
              {selectedSuburb ? (
                selectedSuburb.available ? (
                  <div className="mt-3 flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-3 text-emerald-400 text-xs shadow-xs animate-fade-in">
                    <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                    <div>
                      We serve <strong>{selectedSuburb.name}</strong>!{' '}
                      {selectedSuburb.estimatedTravelFee === 0 ? (
                        <span>Standard local rates apply (Standard travel is fully waived from Ringwood hub).</span>
                      ) : (
                        <span>Includes regional travel surcharge (+${selectedSuburb.estimatedTravelFee} added to transit).</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 text-rose-400 text-xs shadow-xs animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <div>
                      <strong>Geelong</strong> is outside our default same-day region. Please request an custom corporate quote using contact.
                    </div>
                  </div>
                )
              ) : (
                <div className="mt-3 flex items-center gap-1.5 text-zinc-400 text-[11px] font-medium pl-1">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  <span>Base localized hub is Ringwood, serving all eastern &amp; CBD areas of Melbourne.</span>
                </div>
              )}
            </div>

            {/* Step 2: Choice of Service */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-on-surface mb-3">
                2. Select Service Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['residential', 'commercial', 'solar', 'gutter'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setServiceType(type);
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold leading-tight ${
                      serviceType === type
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                        : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-400'
                    }`}
                  >
                    <span className="capitalize">{type === 'solar' ? 'Solar Panels' : type === 'gutter' ? 'Gutter Clean' : type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Adjustable Scale (Sliders based on Selection) */}
            <div className="mb-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-850">
              {serviceType === 'residential' || serviceType === 'commercial' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-on-surface">
                      Number of Glass Panes / Windows
                    </label>
                    <span className="text-sm font-bold bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-800 text-primary">
                      {windowCount} windows
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={windowCount}
                    onChange={(e) => setWindowCount(parseInt(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-semibold">
                    <span>5 (Min)</span>
                    <span>25 (Average House)</span>
                    <span>50 (Large Estate)</span>
                  </div>
                </div>
              ) : serviceType === 'solar' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-on-surface">
                      Number of Solar Panels
                    </label>
                    <span className="text-sm font-bold bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-800 text-primary">
                      {solarPanelCount} panels
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={solarPanelCount}
                    onChange={(e) => setSolarPanelCount(parseInt(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-semibold">
                    <span>4 panels</span>
                    <span>20 units</span>
                    <span>40 max</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-on-surface">
                      Approximate Guttering Length (Meters)
                    </label>
                    <span className="text-sm font-bold bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-800 text-primary">
                      {gutterLength} meters
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={gutterLength}
                    onChange={(e) => setGutterLength(parseInt(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-semibold">
                    <span>10m</span>
                    <span>45m (Average)</span>
                    <span>80m</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Stories Layout Height Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-on-surface mb-2.5">
                3. Building Elevation (Levels)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setStoryCount(level)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      storyCount === level
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                        : 'border-zinc-800 text-zinc-400 bg-zinc-950/40 hover:bg-zinc-900/50'
                    }`}
                  >
                    {level === 1 ? 'Single Story' : level === 2 ? 'Two Storeys' : 'Triple Storey'}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-on-surface-variant/70 italic flex gap-1 pl-1">
                <span>*</span>
                <span>Upper level scheduling involves safety harness rigs and high-reach extension poles.</span>
              </div>
            </div>

            {/* Step 5: High Spec addon elements selection */}
            {(serviceType === 'residential' || serviceType === 'commercial') && (
              <div className="border-t border-zinc-800 pt-6">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-4">
                  Add-on High-Performance Extras:
                </label>
                <div className="space-y-3">
                  {serviceType === 'residential' && (
                    <label className="flex items-center justify-between p-3.5 bg-zinc-950/40 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-900/40 transition-colors border-zinc-800">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={hasScreens}
                          onChange={(e) => setHasScreens(e.target.checked)}
                          className="w-4.5 h-4.5 accent-primary border-zinc-850 rounded"
                        />
                        <div>
                          <div className="text-xs font-bold text-on-surface">Screen Detox Wash</div>
                          <div className="text-[10px] text-zinc-400">We vacuum, wash, &amp; treat screens with anti-dust coating</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">+$3.50ea</span>
                    </label>
                  )}

                  <label className="flex items-center justify-between p-3.5 bg-zinc-950/40 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-900/40 transition-colors border-zinc-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={hasTracks}
                        onChange={(e) => setHasTracks(e.target.checked)}
                        className="w-4.5 h-4.5 accent-primary border-zinc-850 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-on-surface">Deep Track Flush &amp; Vacuum</div>
                        <div className="text-[10px] text-zinc-400">Thorough vacuuming and scrubbing inside matching tracks</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary">+$2.50ea</span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-zinc-950/40 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-900/40 transition-colors border-zinc-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={hasSills}
                        onChange={(e) => setHasSills(e.target.checked)}
                        className="w-4.5 h-4.5 accent-primary border-zinc-850 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-on-surface">Scrub &amp; Buff Frames &amp; Sills</div>
                        <div className="text-[10px] text-zinc-400">Detailing white trim frames, removing oxidation spots</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary">+$1.50ea</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Estimation Summary Panel */}
          <div className="lg:col-span-5 sticky top-24 bg-primary text-black rounded-2xl p-6 md:p-8 shadow-[0_15px_40px_rgba(197,160,89,0.25)] flex flex-col justify-between h-full group relative overflow-hidden">
            {/* Glossy overlay mimicking glass panes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="font-headline-md text-xl font-bold mb-4 flex items-center gap-2 border-b border-black/10 pb-4">
                <CheckCircle2 className="w-5 h-5 text-black" />
                Price Summary
              </h3>

              <div className="space-y-4 mb-8">
                {calculation.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 text-xs font-medium">
                    <span className="text-black/75 font-semibold">{item.label}</span>
                    <span className="font-extrabold tabular-nums shrink-0 text-black">${Math.round(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Total display */}
              <div className="border-t border-black/10 pt-6 mb-8 flex justify-between items-baseline">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-black/60">Estimated Total</span>
                  <p className="text-[10px] text-black/55 italic">Includes GST &amp; complete satisfaction guarantee</p>
                </div>
                <div className="flex items-baseline font-headline-lg text-black">
                  <span className="text-xl font-bold">$</span>
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums">
                    {calculation.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Booking / Action Button */}
            <div className="relative z-10">
              <button
                onClick={() => {
                  if (selectedSuburb && !selectedSuburb.available) {
                    alert('The calculated location is currently outside default transit parameters. Please adjust to a served suburb!');
                    return;
                  }
                  onStartBooking({
                    serviceType,
                    windowCount: serviceType === 'residential' || serviceType === 'commercial' ? windowCount : solarPanelCount,
                    storyCount,
                    hasScreens: serviceType === 'residential' ? hasScreens : false,
                    hasTracks: serviceType === 'residential' || serviceType === 'commercial' ? hasTracks : false,
                    hasSills: serviceType === 'residential' || serviceType === 'commercial' ? hasSills : false,
                    suburb: selectedSuburb ? selectedSuburb.name : suburbSearch || 'Ringwood',
                    estimatedPrice: calculation.total,
                  });
                }}
                className="w-full bg-black text-white border border-transparent font-bold py-4 px-6 rounded-xl hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Continue to Booking Scheduling</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-center text-[10px] text-black/60 mt-3 font-semibold">
                No payment required up-front. Pay only post-clean!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
