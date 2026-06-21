// Room templates rendered as raw styled SVGs and converted to base64 data URLs for immediate testing.

const deskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#f1f5f9"/>
  <!-- Wall Background grid -->
  <line x1="0" y1="200" x2="800" y2="200" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="100" y="50" width="120" height="80" rx="4" fill="#64748b" opacity="0.3"/>
  <rect x="105" y="55" width="110" height="70" rx="2" fill="#94a3b8" opacity="0.8"/>
  
  <!-- Wooden Table top -->
  <rect x="50" y="400" width="700" height="30" fill="#b45309" rx="2"/>
  <!-- Table legs -->
  <rect x="80" y="430" width="25" height="170" fill="#78350f"/>
  <rect x="695" y="430" width="25" height="170" fill="#78350f"/>

  <!-- Keyboard and mouse details -->
  <rect x="280" y="380" width="160" height="15" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
  <rect x="460" y="385" width="20" height="10" rx="5" fill="#475569"/>

  <!-- Clutter Item 1: Stacks of loose papers -->
  <g transform="rotate(-8 200 350)">
    <rect x="130" y="310" width="100" height="70" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <line x1="145" y1="325" x2="215" y2="325" stroke="#94a3b8" stroke-width="2"/>
    <line x1="145" y1="335" x2="205" y2="335" stroke="#94a3b8" stroke-width="2"/>
    <line x1="145" y1="345" x2="210" y2="345" stroke="#94a3b8" stroke-width="2"/>
  </g>
  <g transform="rotate(5 180 340)">
    <rect x="110" y="325" width="105" height="75" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="125" y1="340" x2="195" y2="340" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="125" y1="350" x2="180" y2="350" stroke="#cbd5e1" stroke-width="2"/>
  </g>

  <!-- Clutter Item 2: Multiple coffee mugs and soda cans -->
  <rect x="530" y="320" width="30" height="40" rx="3" fill="#f43f5e" stroke="#be123c" stroke-width="1.5"/>
  <line x1="535" y1="335" x2="555" y2="335" stroke="#be123c" stroke-width="2"/>
  
  <rect x="580" y="300" width="35" height="45" rx="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
  <ellipse cx="597" cy="300" rx="17" ry="5" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.5"/>
  
  <!-- Dirty mug -->
  <rect x="230" y="340" width="25" height="35" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <path d="M 255 345 C 263 345, 263 365, 255 365" fill="none" stroke="#94a3b8" stroke-width="3"/>

  <!-- Big stack of dusty textbooks -->
  <rect x="610" y="290" width="90" height="25" rx="3" fill="#059669" stroke="#047857" stroke-width="2"/>
  <rect x="605" y="315" width="95" height="25" rx="3" fill="#d97706" stroke="#b45309" stroke-width="2"/>
  <rect x="613" y="340" width="92" height="25" rx="3" fill="#4f46e5" stroke="#3730a3" stroke-width="2"/>

  <!-- Clutter Item 3: Tangled bundle of wires under the desk -->
  <path d="M 120 450 C 130 520, 160 480, 180 530 C 200 460, 240 510, 260 480 C 280 540, 200 560, 150 490 Z" fill="none" stroke="#020617" stroke-width="4.5"/>
  <path d="M 140 470 C 150 540, 190 490, 210 520 C 230 470, 250 510, 240 550" fill="none" stroke="#1e293b" stroke-width="3"/>

  <!-- Computer monitor in the background -->
  <rect x="280" y="160" width="240" height="160" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
  <rect x="295" y="175" width="210" height="130" rx="3" fill="#020617"/>
  <!-- Monitor stand -->
  <rect x="385" y="318" width="30" height="55" fill="#334155"/>
  <ellipse cx="400" cy="373" rx="45" ry="10" fill="#334155"/>
  
  <!-- Messy stickie notes on the monitor frame -->
  <rect x="260" y="190" width="25" height="25" fill="#fde047" stroke="#ca8a04" stroke-width="1" transform="rotate(-10 260 190)"/>
  <rect x="505" y="180" width="25" height="25" fill="#fda4af" stroke="#e11d48" stroke-width="1" transform="rotate(15 505 180)"/>
  <rect x="265" y="230" width="25" height="25" fill="#86efac" stroke="#16a34a" stroke-width="1" transform="rotate(5 265 230)"/>

  <!-- Text sign for Course/Github reference quality -->
  <rect x="280" y="10" width="240" height="35" rx="5" fill="#0f172a"/>
  <text x="400" y="32" font-family="monospace" font-size="14" fill="#38bdf8" text-anchor="middle" font-weight="bold">TEMPLATE: DESK CLUTTER</text>
</svg>`;

const closetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#f8fafc"/>
  <!-- Closet Frame outer border -->
  <rect x="80" y="40" width="640" height="520" rx="6" fill="#78350f" opacity="0.95"/>
  <rect x="100" y="55" width="600" height="490" fill="#fdfbf7"/>

  <!-- Top Shelf -->
  <rect x="100" y="150" width="600" height="15" fill="#92400e"/>
  <!-- Middle divider -->
  <rect x="390" y="165" width="15" height="380" fill="#92400e"/>

  <!-- Hanging rod on left -->
  <line x1="100" y1="180" x2="390" y2="180" stroke="#94a3b8" stroke-width="8"/>

  <!-- Hangers and Cluttered Clothes on Rod -->
  <!-- Clothes 1: Tilted red coat -->
  <line x1="140" y1="180" x2="160" y2="340" stroke="#ef4444" stroke-width="40" stroke-linecap="round"/>
  <line x1="140" y1="180" x2="148" y2="188" stroke="#475569" stroke-width="3"/>
  
  <!-- Clothes 2: Messy purple dress overlapping -->
  <line x1="190" y1="180" x2="220" y2="380" stroke="#8b5cf6" stroke-width="50" stroke-linecap="round" opacity="0.9"/>
  
  <!-- Clothes 3: Wrinkled yellow shirt falling off -->
  <g transform="rotate(25 240 180)">
    <line x1="240" y1="180" x2="245" y2="290" stroke="#facc15" stroke-width="45" stroke-linecap="round"/>
  </g>

  <!-- Top Shelf Clutter: Stack of disorganized box containers sliding -->
  <g transform="rotate(12 200 90)">
    <rect x="140" y="70" width="120" height="55" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  </g>
  <rect x="180" y="90" width="130" height="60" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <rect x="420" y="80" width="220" height="70" rx="3" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
  <text x="530" y="115" font-family="sans-serif" font-size="12" fill="#c2410c">"MISCELLANEOUS CLUTTER"</text>

  <!-- Right Cubbies with folded clothes in total disarray (spilling out) -->
  <rect x="405" y="250" width="295" height="15" fill="#92400e"/>
  <rect x="405" y="370" width="295" height="15" fill="#92400e"/>

  <!-- Overstuffed cubby clothes -->
  <path d="M 430 200 Q 480 180, 500 230 Q 520 200, 560 210 Q 570 248, 430 248 Z" fill="#3b82f6"/>
  <path d="M 460 210 Q 510 190, 550 240 Z" fill="#60a5fa" opacity="0.8"/>

  <!-- Cubby 2: Unfolded items exploding -->
  <path d="M 420 340 L 590 320 L 580 365 L 415 365 Z" fill="#10b981" stroke="#047857" stroke-width="2"/>
  <ellipse cx="500" cy="320" rx="40" ry="25" fill="#f43f5e"/>

  <!-- Floor of closet: Pile of shoes piled up haphazardly -->
  <rect x="120" y="490" width="50" height="20" rx="4" fill="#a855f7" stroke="#7e22ce" stroke-width="2" transform="rotate(25 120 490)"/>
  <rect x="140" y="500" width="50" height="20" rx="4" fill="#a855f7" stroke="#7e22ce" stroke-width="2" transform="rotate(-15 140 500)"/>
  
  <rect x="220" y="505" width="55" height="22" rx="4" fill="#06b6d4" stroke="#0891b2" stroke-width="2" transform="rotate(95 220 505)"/>
  <rect x="260" y="495" width="55" height="22" rx="4" fill="#f97316" stroke="#c05621" stroke-width="2" transform="rotate(-40 260 495)"/>

  <!-- Massive heap of dirty clothes/toys on the floor -->
  <path d="M 330 540 C 310 460, 480 440, 500 480 C 520 450, 600 460, 640 540 Z" fill="#94a3b8" stroke="#475569" stroke-width="3"/>
  <path d="M 360 540 C 380 480, 440 480, 470 510 Q 550 490, 580 540 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>

  <!-- Sign bar -->
  <rect x="280" y="10" width="240" height="35" rx="5" fill="#1e293b"/>
  <text x="400" y="32" font-family="monospace" font-size="14" fill="#fda4af" text-anchor="middle" font-weight="bold">TEMPLATE: CLOSET EXPLOSION</text>
</svg>`;

const livingRoomSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#f8fafc"/>
  
  <!-- Wall perspective line -->
  <line x1="0" y1="150" x2="800" y2="150" stroke="#e2e8f0" stroke-width="2"/>
  <line x1="250" y1="150" x2="250" y2="0" stroke="#cbd5e1" stroke-width="1.5"/>

  <!-- Window shadow -->
  <rect x="350" y="40" width="140" height="90" fill="#bae6fd" opacity="0.6" stroke="#e0f2fe" stroke-width="3"/>

  <!-- Sofa Base on Floor -->
  <rect x="150" y="300" width="500" height="150" rx="30" fill="#1e3a8a"/>
  <!-- Cushions -->
  <rect x="180" y="270" width="140" height="80" rx="15" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
  <rect x="330" y="270" width="140" height="80" rx="15" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
  <rect x="480" y="270" width="140" height="80" rx="15" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>

  <!-- Messy Sofa Items: heaps of laundry piled on sofa -->
  <path d="M 200 300 C 180 230, 240 220, 260 250 C 280 210, 340 230, 360 300 Z" fill="#fb923c" stroke="#ea580c" stroke-width="2"/>
  <path d="M 450 320 C 430 260, 480 250, 520 280 C 530 250, 580 260, 590 320 Z" fill="#ec4899" stroke="#db2777" stroke-width="2"/>

  <!-- Sofa pillows sliding off -->
  <rect x="580" y="330" width="50" height="50" rx="8" fill="#facc15" stroke="#f59e0b" stroke-width="2" transform="rotate(35 580 330)"/>
  <rect x="120" y="360" width="50" height="50" rx="8" fill="#10b981" stroke="#059669" stroke-width="2" transform="rotate(-15 120 360)"/>

  <!-- Coffee table in front -->
  <rect x="220" y="450" width="360" height="30" rx="3" fill="#7c2d12"/>
  <rect x="260" y="480" width="20" height="120" fill="#451a03"/>
  <rect x="520" y="480" width="20" height="120" fill="#451a03"/>

  <!-- Spills and trash on Coffee Table -->
  <ellipse cx="260" cy="450" rx="25" ry="5" fill="#fed7aa"/>
  <rect x="380" y="420" width="35" height="30" rx="5" fill="#a1a1aa" stroke="#71717a" stroke-width="1.5"/>
  <line x1="395" y1="420" x2="395" y2="450" stroke="#71717a" stroke-width="3"/>

  <!-- Scattered magazines on table -->
  <rect x="440" y="435" width="70" height="15" fill="#fdfbf7" stroke="#d4d4d8" stroke-width="1" transform="rotate(-5 440 435)"/>
  <rect x="450" y="440" width="65" height="15" fill="#f43f5e" stroke="#be123c" stroke-width="1" transform="rotate(12 450 440)"/>

  <!-- Floor clutter: pile of kids toys and board games stacked precariously -->
  <rect x="620" y="460" width="90" height="30" fill="#a855f7" stroke="#7e22ce" stroke-width="2" transform="rotate(12 620 460)"/>
  <rect x="610" y="490" width="100" height="35" fill="#06b6d4" stroke="#0891b2" stroke-width="2" transform="rotate(-5 610 490)"/>
  
  <circle cx="680" cy="540" r="25" fill="#ef4444" stroke="#be123c" stroke-width="2"/>
  <rect x="710" y="520" width="40" height="40" rx="8" fill="#10b981"/>

  <!-- Stack of remote controls on the floor -->
  <rect x="140" y="540" width="55" height="15" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" transform="rotate(30 140 540)"/>
  <rect x="150" y="550" width="55" height="15" fill="#27272a" stroke="#3f3f46" stroke-width="1.5" transform="rotate(45 150 550)"/>

  <!-- Title card -->
  <rect x="280" y="10" width="240" height="35" rx="5" fill="#111827"/>
  <text x="400" y="32" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">TEMPLATE: FAMILY LIVING ROOM</text>
</svg>`;

// Helper function to encode string as base64 in standard data URI
export function svgToDataUri(svgString: string): string {
  // Convert standard SVG code to clean XML string, then base64 URL safe representation
  const cleanSvg = svgString.trim();
  const b64 = typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(cleanSvg))) : Buffer.from(cleanSvg).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

export interface SampleTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  dataUri: string;
  // A template analysis block preloaded to skip server-side execution if desired, but we can call real API
  defaultAnalysis: {
    clutterScore: number;
    category: string;
    assessment: string;
    areasOfConcern: string[];
    checklist: Array<{ id: string; item: string; priority: 'High' | 'Medium' | 'Low'; zone: string; category: 'keep' | 'donate' | 'discard' | 'relocate'; completed: boolean }>;
    strategies: Array<{ zone: string; proposal: string; productsSuggested: string[] }>;
    maintenanceRoutine: string[];
  };
}

export const SAMPLE_ROOMS: SampleTemplate[] = [
  {
    id: "sample_officedesk",
    name: "Messy Home Office",
    category: "Home Office",
    description: "Piles of scatter manuscripts, loose cords, and multiple redundant drinkware containers on desk.",
    dataUri: svgToDataUri(deskSvg),
    defaultAnalysis: {
      clutterScore: 7,
      category: "Home Office Desk",
      assessment: "Your home office desk possesses excellent desktop surface space but is currently suffering from a high concentration of loose papers, chaotic visual items, and cable entanglement. Organizing this will double your cognitive focus & productivity.",
      areasOfConcern: [
        "Loose document backlog flanking the computer stand",
        "Multiple lingering hydration containers (mugs and aluminum cans)",
        "Tangled power cords and phone cables hanging under and behind the desk space"
      ],
      checklist: [
        { id: "desk-1", item: "Collect all cups, cans, and mugs and transfer them to the kitchen dishwasher.", priority: "High", zone: "Desk surface right side", category: "discard", completed: false },
        { id: "desk-2", item: "Gather scattered paperwork and place into a master sorting pile.", priority: "High", zone: "Paper stacks", category: "keep", completed: false },
        { id: "desk-3", item: "De-tangle and coil primary computer and charger cables with wire ties.", priority: "Medium", zone: "Under-desk footprint", category: "relocate", completed: false },
        { id: "desk-4", item: "Scan or discard outdated notes and expired mail.", priority: "Medium", zone: "Paper stacks", category: "discard", completed: false },
        { id: "desk-5", item: "Relocate books back to bookshelves rather than stacking on the surface.", priority: "Low", zone: "Textbook stack", category: "relocate", completed: false },
        { id: "desk-6", item: "Donate duplicate calculators or desk accessories you no longer use.", priority: "Low", zone: "Desk drawers", category: "donate", completed: false }
      ],
      strategies: [
        {
          zone: "Primary Desktop Left Region",
          proposal: "Implement a dedicated multi-tier wire letter tray to separate current action projects, reference folders, and incoming mail to keep them off the main working space.",
          productsSuggested: ["3-Tier Mesh Desktop Letter Tray", "Small sticky-note magnetic dock"]
        },
        {
          zone: "Under Desk Floor Footprint",
          proposal: "Install a simple adhesive horizontal cable management basket under the tabletop edge. Route all power strips and heavy bricks into this basket to keep the floor completely unobstructed.",
          productsSuggested: ["Metal Under-Table Cable Management Tray", "Hook-and-loop velcro cord ties"]
        },
        {
          zone: "Mug & Beverage Zone",
          proposal: "Establish a strict single-vessel rule. Keep exactly one active water bottle or insulated coffee mug in your office at any point. Returning dishes promptly acts as a natural screen break.",
          productsSuggested: ["Minimalist cork coaster", "Spill-proof desktop bottle holder"]
        }
      ],
      maintenanceRoutine: [
        "The 5-Minute Clear: Every evening, clear all beverage containers and throw away absolute trash.",
        "File-as-You-Go: File immediately rather than letting paper stacks aggregate over 3 days.",
        "Cable Audit: Check cord alignment weekly to ensure no tangles develop."
      ]
    }
  },
  {
    id: "sample_bedroomcloset",
    name: "Locked Closet Havoc",
    category: "Bedroom Closet",
    description: "Hangers in disarray, shoes dumped haphazardly on floor, clothes falling off rails.",
    dataUri: svgToDataUri(closetSvg),
    defaultAnalysis: {
      clutterScore: 8,
      category: "Closet and Footwear Cabinets",
      assessment: "The closet layout is structurally versatile, offering vertical shelving and divided drawers. However, clothes are currently overflowing across rails and shoe clutter on the floor blocks physical entry. Categorization will make getting ready joyful.",
      areasOfConcern: [
        "Disorganized piles of dirty/clean laundry mixed on floor",
        "Clothes sliding off standard plastic hangers onto low racks",
        "Disorganized miscellaneous boxes on top shelf with low space utilization"
      ],
      checklist: [
        { id: "closet-1", item: "Pull all garments off the closet floor and put in hamper/wash cycle.", priority: "High", zone: "Closet Floor", category: "keep", completed: false },
        { id: "closet-2", item: "Sort shoes into physical pairs and isolate singles missing mates.", priority: "High", zone: "Floor Entryway", category: "discard", completed: false },
        { id: "closet-3", item: "Perform the 'Sparks Joy' sorting on sweaters piling out of right cubbies.", priority: "Medium", zone: "Right Divider Rack", category: "donate", completed: false },
        { id: "closet-4", item: "Upgrade flimsy sliding hangers with high-friction velvet replacements.", priority: "Medium", zone: "Hanging bar", category: "relocate", completed: false },
        { id: "closet-5", item: "Label general boxes on top shelves for clear categorization.", priority: "Low", zone: "Top shelving", category: "keep", completed: false }
      ],
      strategies: [
        {
          zone: "Floor Entryway",
          proposal: "Add an expandable 3-tier horizontal metal shoe organizer rack. Aligning all shoes on low tiers immediately reclaims physical floor footprint.",
          productsSuggested: ["Expandable 3-Tier Shoe Rack Organizer", "Clear plastic drop-front sneaker storage boxes"]
        },
        {
          zone: "Right Side Cubby Racks",
          proposal: "Use collapsible fabric storage baskets that slide cleanly into the dividers. This hides folded t-shirts, socks, and seasonal sports gear instantly.",
          productsSuggested: ["Collapsible Fabric Closet Bins with Handles (set of 4)", "Shelf divider clips"]
        }
      ],
      maintenanceRoutine: [
        "The Hanger Trick: Turn all hangers backwards. When you wear a piece, turn its hanger frontward. Assess unturned items in six months to donate them.",
        "One-In-One-Out Daily Habit: When you purchase or bring in a new apparel item, donate one existing wardrobe piece.",
        "Floor Clearance: Ensure nothing touchable rests permanently on the physical closet floor except the shoe rack."
      ]
    }
  },
  {
    id: "sample_familyliving",
    name: "Cluttered Family Room",
    category: "Living Room",
    description: "Sofa laden with items, scattered magazines, and toy piles covering the main transit flow.",
    dataUri: svgToDataUri(livingRoomSvg),
    defaultAnalysis: {
      clutterScore: 6,
      category: "Family Living Room",
      assessment: "The living room feels warm and lived-in, but active toy accumulation, multiple scattered controllers, and sofa-top laundry block social use. A few key containment strategies will keep it serene for hosting.",
      areasOfConcern: [
        "Sofa cushions overloaded with clothes and loose pillows",
        "Tabletop scattered with spills, cups, and loose reading materials",
        "Haphazard toy stacks on the corner floor creating tripping issues"
      ],
      checklist: [
        { id: "living-1", item: "Remove folded laundry load from cushions and store in dressers.", priority: "High", zone: "Sofa seats", category: "relocate", completed: false },
        { id: "living-2", item: "Wipe down coffee table spills and discard old magazines.", priority: "High", zone: "Coffee tabletop", category: "discard", completed: false },
        { id: "living-3", item: "Consolidate scattered toys into a uniform container basket.", priority: "Medium", zone: "Right Corner Floor", category: "keep", completed: false },
        { id: "living-4", item: "Find dedicated tray dock for home TV, sound, and console controllers.", priority: "Medium", zone: "Floor/Coffee Table", category: "relocate", completed: false },
        { id: "living-5", item: "Donate children's puzzles or board games with missing components.", priority: "Low", zone: "Right Corner Floor", category: "donate", completed: false }
      ],
      strategies: [
        {
          zone: "Sofa and Corner Transit Lanes",
          proposal: "Introduce an aesthetic storage ottoman bench in front of the sofa. It doubles as a comfy footrest and hides children's gear, blankets, or play controllers completely out of sight.",
          productsSuggested: ["Tufted Storage Ottoman Bench in Charcoal Gray", "Soft knit cotton blanket basket"]
        },
        {
          zone: "Coffee Table Tray System",
          proposal: "Adopt a decorative wooden tray on the center table. All small decorative items, coasters, and active television remotes must sit inside this designated perimeter, creating natural neatness.",
          productsSuggested: ["Rustic rectangular wooden service tray", "Leather remote control caddy"]
        }
      ],
      maintenanceRoutine: [
        "10-Minute Reset: Assemble family members for a quick basket sweep before bedtime.",
        "Zone-Based Play: Restrict kid toy containers to the toy ottoman to prevent sprawl.",
        "Paper Cycle: Recycle catalogs and magazines weekly directly from the center tables."
      ]
    }
  }
];
