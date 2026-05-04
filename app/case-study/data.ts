export interface CaseMetric {
  v: string;
  l: string;
  desc: string;
}

export interface CaseStudy {
  slug: string;
  brand: string;
  category: string;
  headline: string;
  subheadline?: string;
  img: string;
  period: string;
  objective?: string;
  region?: string;
  tags: string[];
  metrics: CaseMetric[];
  overview: {
    challenge: string;
    solution: string;
    result: string;
  };
  keyTakeaway?: string;
  approach: { title: string; desc: string }[];
  channels: string[];
  testimonial?: { quote: string; name: string; role: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "singapore-airlines",
    brand: "Singapore Airlines",
    category: "Travel",
    headline: "Premium video drove a 38% lift in flight searches across SEA.",
    img: "/assets/featured-case-1.png",
    period: "Q3 2025 · 12 weeks",
    tags: ["CTV", "PROGRAMMATIC", "VIDEO"],
    metrics: [
      { v: "+38%", l: "Search Lift", desc: "Increase in branded flight search queries across SEA markets" },
      { v: "2.4×", l: "ROAS",       desc: "Return on ad spend vs pre-campaign baseline" },
      { v: "12M",  l: "Reach",      desc: "Unique users reached across WEB + CTV placements" },
      { v: "92%",  l: "VCR",        desc: "Video completion rate on premium in-stream inventory" },
    ],
    overview: {
      challenge: "Singapore Airlines needed to rebuild travel intent across SEA after a post-pandemic lull in bookings. The brief was to drive qualified top-of-funnel awareness across SG, ID, MY, and TH — without cannibalising performance search budgets.",
      solution: "We deployed a sequenced CTV + programmatic video strategy: premium in-stream on CTV OEMs for awareness, followed by retargeted mid-scroll video units on mobile web to drive search intent. All creative was dynamically localised per market.",
      result: "By week 10, branded flight search queries were up 38% YoY in target markets. CTV drove the majority of reach at a CPM 44% below paid social benchmarks. ROAS across the full funnel hit 2.4× — above client KPI of 1.8×.",
    },
    approach: [
      { title: "Audience Architecture", desc: "Built custom intent segments from first-party travel-behaviour data, layered with 3rd-party in-market travel audiences across 4 SSPs. Excluded recent converters to avoid waste." },
      { title: "Creative Sequencing", desc: "30s brand spot on CTV for cold audiences → 15s product-specific cut for mid-funnel retarget → 6s bumper for bottom-of-funnel push. Each market received localised voiceover and end-card copy." },
      { title: "Media Mix", desc: "60% CTV (MiQ + DistroScale), 25% programmatic video web, 15% in-app video via GoNet DSP. Bids optimised daily by our ML price optimizer to shift budget toward highest-VCR placements." },
      { title: "Brand Safety", desc: "All inventory pre-screened via IAS. Zero adjacency to news, UGC, or travel-disruption content. Brand safety rate held above 99.2% throughout." },
    ],
    channels: ["CTV", "Programmatic Video", "In-App Video", "Mobile Web"],
    testimonial: {
      quote: "Go Mobile brought a level of trading rigour we hadn't seen from previous agencies. The sequenced CTV approach was exactly what our brand needed — and the results backed it up.",
      name: "Marcus Tan",
      role: "Head of Performance Marketing, Singapore Airlines",
    },
  },
  {
    slug: "indofood",
    brand: "Indofood",
    category: "FMCG",
    headline: "Gamified rich media outperformed display CTR by 6× across in-app inventory.",
    img: "/assets/featured-case-2.png",
    period: "Q2 2025 · 8 weeks",
    tags: ["RICH MEDIA", "IN-APP", "GAMIFIED"],
    metrics: [
      { v: "6.1×", l: "vs Display CTR",     desc: "CTR uplift vs standard display baseline on same inventory" },
      { v: "27s",  l: "Avg Engagement",      desc: "Average time spent interacting with the gamified unit" },
      { v: "4.2M", l: "Interactions",        desc: "Total user interactions across the gamified ad units" },
      { v: "-18%", l: "eCPE",                desc: "Cost per engagement vs benchmarked rich media norms" },
    ],
    overview: {
      challenge: "Indofood's Chitato snack brand needed to drive trial consideration among 18–34-year-olds in Java and Bali. Standard display was delivering impressions but near-zero engagement. The brief: make people stop, interact, and remember the product.",
      solution: "We built a scratch-to-reveal gamified HTML5 unit in-house — users scratched a virtual bag to 'unlock' a new flavour, then were served a coupon for the nearest retailer. The unit ran across premium in-app inventory in gaming and entertainment apps.",
      result: "Engagement time averaged 27 seconds — benchmark for the category is under 5s. CTR was 6.1× the standard display baseline on identical inventory. Post-campaign brand recall in the target cohort was up 41%.",
    },
    approach: [
      { title: "Creative Concept", desc: "Our in-house HTML5 team designed the scratch mechanic around the physical packaging. The reveal animation mirrored opening a crisp packet — reinforcing product memory at the moment of interaction." },
      { title: "Targeting", desc: "In-app placements in gaming (puzzle, casual), food delivery, and social utility apps. Audience layered with convenience store proximity data to ensure coupon relevance." },
      { title: "Optimisation", desc: "Mid-campaign creative split test between 3 scratch patterns. The foil-texture variant outperformed flat-colour by 34% on interaction rate — budget shifted within 48 hours." },
      { title: "Attribution", desc: "Footfall uplift tracked via SKAdNetwork + third-party offline attribution panel across 200 Alfamart locations in test markets." },
    ],
    channels: ["In-App Display", "HTML5 Rich Media", "Gaming Inventory"],
    testimonial: {
      quote: "The gamified unit Go Mobile built didn't feel like an ad — it felt like a feature. Engagement numbers we've never seen from a media buy.",
      name: "Dewi Kusuma",
      role: "Digital Marketing Lead, Indofood",
    },
  },
  {
    slug: "bank-jago",
    brand: "Bank Jago",
    category: "Banking",
    headline: "Always-on programmatic delivered a 22% lower CAC than social-only baselines.",
    img: "/assets/featured-case-3.png",
    period: "Q4 2024 – Q1 2025 · 24 weeks",
    tags: ["PROGRAMMATIC", "NATIVE", "DISPLAY"],
    metrics: [
      { v: "-22%", l: "CAC",             desc: "Reduction in cost per acquired customer vs social-only baseline" },
      { v: "+58%", l: "Acquisitions",    desc: "Incremental app installs attributable to programmatic channel" },
      { v: "98.7%", l: "Brand Safe",     desc: "Impressions served on verified brand-safe inventory" },
      { v: "3.1M", l: "New Users Reach", desc: "Net-new users reached not covered by existing social campaigns" },
    ],
    overview: {
      challenge: "Bank Jago's growth team had saturated their Meta + TikTok audiences and was seeing CAC climb quarter-over-quarter. The challenge: find qualified incremental reach outside the social walled gardens, at a lower acquisition cost.",
      solution: "We built an always-on programmatic layer using GoNet DSP — combining native and display formats across premium fintech-adjacent content (personal finance, news, lifestyle). First-party CRM data was used to suppress existing customers and build lookalike seeds.",
      result: "Over 24 weeks, programmatic channel delivered a 22% lower CAC than the social baseline. 58% incremental lift in app acquisitions. Brand safety held at 98.7% across 140M+ impressions.",
    },
    approach: [
      { title: "Audience Strategy", desc: "First-party CRM suppression list of 2.1M existing customers. Lookalike modelling built from top 20% LTV cohort. Contextual layer added for fintech, personal finance, and career content verticals." },
      { title: "Format Mix", desc: "70% native (blended into article feeds on Kompas, Detik, CNN ID) + 30% display (interscroller + banner on premium apps). Native drove 3× lower CPC than display." },
      { title: "Always-On Cadence", desc: "24/7 live optimisation by our trading desk. Bid floor adjustments 4× daily based on win rate and conversion signals. Weekly creative rotation to combat fatigue." },
      { title: "Measurement", desc: "Incrementality tested via geo holdout across Surabaya (test) and Medan (control) markets. Lift in app installs confirmed +58% incremental above organic baseline." },
    ],
    channels: ["Programmatic Display", "Native Ads", "GoNet DSP"],
  },
  {
    slug: "maybank",
    brand: "Maybank",
    category: "Banking",
    headline: "Cross-channel orchestration drove a 1.8× lift in qualified leads.",
    img: "/assets/featured-case-1.png",
    period: "Q1 2025 · 10 weeks",
    tags: ["DISPLAY", "META", "VIDEO"],
    metrics: [
      { v: "1.8×", l: "Qualified Leads", desc: "Increase in MQL volume vs previous quarter" },
      { v: "-31%", l: "CPL",              desc: "Reduction in cost per qualified lead across all channels" },
      { v: "4.2M", l: "Reach",            desc: "Unique users reached across programmatic + social" },
      { v: "+44%", l: "Form Completions", desc: "Increase in product application form completions" },
    ],
    overview: {
      challenge: "Maybank Malaysia was running siloed channel buys with no unified audience strategy. CPL was high and lead quality was inconsistent across channels. The ask: build a coordinated funnel with shared audience logic and cleaner attribution.",
      solution: "We rebuilt the media architecture from scratch — unified first-party data across Meta and programmatic, sequential messaging by funnel stage, and a single reporting dashboard with de-duplicated cross-channel reach.",
      result: "CPL dropped 31% in the first 6 weeks. Qualified lead volume grew 1.8× by end of campaign. Form completion rate up 44%.",
    },
    approach: [
      { title: "Unified Audience Layer", desc: "Matched CRM data across Meta CAPI, GoNet DSP, and GDN. Single suppression list ensures no existing customers are re-acquired. Lookalike seeds built from high-intent web behaviour." },
      { title: "Sequential Messaging", desc: "Week 1–3: awareness video on Meta + programmatic display. Week 4–6: product feature native ads. Week 7–10: direct response with form-fill CTA. Frequency capped at 3× per stage per user." },
      { title: "Creative Strategy", desc: "Localised English + Bahasa Malaysia creative for each stage. A/B tested headline variants weekly. Benefit-led copy outperformed feature-led by 28% on CTR." },
    ],
    channels: ["Meta Ads", "Programmatic Display", "Native", "Video"],
  },
  {
    slug: "iqos",
    brand: "IQOS",
    category: "Lifestyle",
    headline: "Audience-first targeting cut wasted impressions by 41% in launch markets.",
    img: "/assets/featured-case-2.png",
    period: "Q3 2024 · 6 weeks",
    tags: ["NATIVE", "AUDIENCE", "TIKTOK"],
    metrics: [
      { v: "-41%", l: "Wasted Impressions", desc: "Reduction in impressions served outside target audience" },
      { v: "+62%", l: "Brand Recall",        desc: "Lift in aided brand recall among 25–35 urban professionals" },
      { v: "3.1×", l: "Engagement",          desc: "vs category benchmark for lifestyle product launches" },
      { v: "8.4M", l: "Reach",               desc: "Total reach across TikTok + programmatic native channels" },
    ],
    overview: {
      challenge: "IQOS was launching in new urban markets across Indonesia and needed to reach adult smokers aged 25–40 in premium urban contexts — without serving ads to the wrong audience or in unsuitable environments.",
      solution: "We used GoNet's AI contextual engine to identify premium lifestyle content environments (fashion, F&B, tech, fitness) and layered behavioural segments from first-party intent signals. TikTok ran in parallel for social proof.",
      result: "Wasted impressions dropped 41%. Brand recall up 62% among primary target. Engagement 3.1× category benchmark.",
    },
    approach: [
      { title: "Contextual Intelligence", desc: "GoNet's computer vision engine scanned full-page content to identify premium lifestyle contexts. Excluded news, health, and tobacco-adjacent content per compliance brief." },
      { title: "Audience Precision", desc: "Custom segments built from urban lifestyle app behaviour, premium dining and travel intent signals, and income proxy indicators. Audience verified pre-bid." },
      { title: "TikTok Integration", desc: "Parallel TikTok Spark Ads using creator content from premium lifestyle influencers. Audience sync between TikTok and programmatic ensured consistent messaging across channels." },
    ],
    channels: ["GoNet DSP", "TikTok", "Native Ads", "Programmatic Display"],
  },
  {
    slug: "ocbc",
    brand: "OCBC",
    category: "Banking",
    headline: "Sequential CTV + mobile retargeting lifted product application starts by 47%.",
    img: "/assets/featured-case-3.png",
    period: "Q4 2025 · 8 weeks",
    tags: ["CTV", "MOBILE", "PROGRAMMATIC"],
    metrics: [
      { v: "+47%", l: "App Starts",  desc: "Increase in product application starts vs control group" },
      { v: "-19%", l: "CPA",         desc: "Cost per application start reduction vs previous campaign" },
      { v: "9.6M", l: "Reach",       desc: "Total unique users reached across CTV + mobile channels" },
      { v: "2.2×", l: "Lift",        desc: "Incrementality test lift vs holdout market" },
    ],
    overview: {
      challenge: "OCBC Singapore needed to drive product application starts for their new credit card tier. Previous campaigns had hit frequency fatigue on social. The brief: find a new reach channel that could prime intent before mobile retargeting kicked in.",
      solution: "CTV as the priming layer — 30s brand spots on premium streaming apps — followed by a 72-hour retargeting window on mobile web and in-app. The sequence created a halo effect that dramatically improved mobile retargeting performance.",
      result: "Application starts up 47%. CPA down 19%. Incrementality test confirmed 2.2× lift vs holdout.",
    },
    approach: [
      { title: "CTV as Priming Layer", desc: "Premium in-stream on Viu, meWatch, and local FAST channels. 30s brand spots built for a lean-back, household viewing context. Frequency capped at 2× per household per week." },
      { title: "Retargeting Window", desc: "72-hour mobile retargeting window post-CTV exposure. Users matched via household IP graph. 15s direct-response cuts with product benefit and CTA." },
      { title: "Bid Strategy", desc: "ML price optimizer prioritised mobile bids for CTV-exposed users — win rate on this cohort was 34% higher, confirming intent uplift from CTV priming." },
    ],
    channels: ["CTV", "Mobile Web", "In-App", "Programmatic"],
    testimonial: {
      quote: "The CTV-to-mobile sequence was a hypothesis we'd wanted to test for a year. Go Mobile built and measured it properly — the lift data was conclusive.",
      name: "Priya Nair",
      role: "VP Digital Marketing, OCBC",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
