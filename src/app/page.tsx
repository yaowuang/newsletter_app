import Link from 'next/link';
// import Image from 'next/image';
import { Metadata } from 'next';
import ExampleCarousel from '@/components/ExampleCarousel';

// Optimized metadata for your homepage
export const metadata: Metadata = {
  metadataBase: new URL('https://elementaryschoolnewsletters.com'),
  title: 'Elementary School Newsletter Builder | Free Classroom Newsletter Templates',
  description: 'Create engaging elementary school newsletters in minutes. Drag-and-drop sections, kid-friendly themes, instant PDF / PNG / SVG export. Free, no login.',
  keywords: ['elementary school newsletter','classroom newsletter builder','newsletter templates for teachers','school newsletter export PDF','free school newsletter tool'],
  alternates: { canonical: 'https://elementaryschoolnewsletters.com/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    url: 'https://elementaryschoolnewsletters.com/',
    siteName: 'Elementary School Newsletter Builder',
    locale: 'en_US',
    title: 'Elementary School Newsletter Builder – Create Classroom Newsletters Fast',
    description: 'Free drag-and-drop builder for engaging elementary school newsletters. Themes, emojis, instant exports.',
    images: [
      {
        url: 'https://elementaryschoolnewsletters.com/examples/default.png',
        width: 1200,
        height: 630,
        alt: 'Elementary school newsletter template examples'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elementary School Newsletter Builder',
    description: 'Build & export engaging classroom newsletters in minutes – free, no login.',
    images: ['https://elementaryschoolnewsletters.com/examples/default.png']
  }
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0c1220] via-[#101a32] to-[#1b2240] text-slate-100 selection:bg-blue-500/30">
      {/* Global background enhancements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_65%)] blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(99,102,241,0.08),transparent_55%)]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-[0.05] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_70%)] opacity-20" />
      </div>

      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-slate-900 focus:text-white">Skip to content</a>

      {/* Header */}
      <Header />

      <main id="main" className="relative z-10">
        <Hero />
        <Features />
        <ValueStack />
        <CTA />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Elementary School Newsletter Builder',
                applicationCategory: 'EducationApplication',
                operatingSystem: 'Web',
                description: 'Free drag-and-drop elementary school newsletter builder with themes and instant PDF, PNG, SVG export.',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
              },
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  { '@type': 'Question', name: 'Is it free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes – all core features are available.' } },
                  { '@type': 'Question', name: 'Do I need an account?', acceptedAnswer: { '@type': 'Answer', text: 'No account or login required. Open & build instantly.' } },
                  { '@type': 'Question', name: 'iPad compatible?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Panels & drag interactions support touch.' } },
                  { '@type': 'Question', name: 'How do I share?', acceptedAnswer: { '@type': 'Answer', text: 'Export PNG / SVG / PDF and embed or send anywhere.' } }
                ]
              },
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Newsletter Builder Features',
                itemListOrder: 'Ordered',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Live Section Styling' },
                  { '@type': 'ListItem', position: 2, name: 'Smart Headings' },
                  { '@type': 'ListItem', position: 3, name: 'Drag & Arrange' },
                  { '@type': 'ListItem', position: 4, name: 'Emojis & Icons' },
                  { '@type': 'ListItem', position: 5, name: 'Theme System' },
                  { '@type': 'ListItem', position: 6, name: 'Export Suite' }
                ]
              }
            ])
          }}
        />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-4 z-40 max-w-7xl mx-auto px-5 py-4 flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="font-semibold tracking-tight text-lg sm:text-xl bg-gradient-to-r from-sky-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">Elementary School Newsletters</span>
      </div>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
        {['Features','Value','FAQ'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="relative group transition">
            <span className="group-hover:text-white transition-colors">{item}</span>
            <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300" />
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/builder" className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-5 py-2.5 text-sm font-semibold shadow-[0_6px_28px_-6px_rgba(59,130,246,0.55)] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60">Launch Builder <span className="ml-1">→</span></Link>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <rect x="6" y="14" width="16" height="36" rx="2" className="fill-sky-500" />
        <rect x="24" y="10" width="16" height="40" rx="2" className="fill-indigo-500" />
        <rect x="42" y="18" width="16" height="32" rx="2" className="fill-fuchsia-500" />
        <rect x="9" y="20" width="10" height="2" className="fill-white/90" />
        <rect x="27" y="16" width="10" height="2" className="fill-white/90" />
        <rect x="45" y="24" width="10" height="2" className="fill-white/90" />
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-14 pb-16" aria-labelledby="hero-heading">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[1400px] h-[1400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_65%)] blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_70%)]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-[0.08] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col gap-14">
        {/* Text Block */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-sm mb-6 text-[11px] font-medium tracking-wide text-slate-300 shadow-inner shadow-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" /> New: PDF & SVG Export
          </div>
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Build <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">newsletter magic</span>
              <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-lg blur-md opacity-25 bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500" />
            </span> in minutes
          </h1>
          <p className="mt-6 text-lg text-slate-300/90 max-w-[50ch] mx-auto leading-relaxed">A focused dark‑mode <strong className="font-semibold">elementary school newsletter builder</strong> for classrooms. Craft, style & share weekly updates with ready-made templates—no logins, no clutter.</p>
          <p className="mt-4 text-sm text-slate-400 max-w-[60ch] mx-auto leading-relaxed">Create a free classroom newsletter, reuse last week’s layout, and export polished PDFs, PNG or SVG files in seconds. Perfect for teachers needing a simple, accessible school newsletter template.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/builder" className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_8px_30px_-6px_rgba(59,130,246,0.55)] hover:shadow-[0_8px_34px_-4px_rgba(99,102,241,0.55)] transition">
              Start Free <span className="text-base translate-x-0 group-hover:translate-x-0.5 transition">→</span>
            </Link>
            <a href="#features" className="inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-medium bg-white/7 ring-1 ring-white/15 hover:bg-white/10 transition">See Features</a>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-5 text-[11px] uppercase tracking-wider text-slate-500">
            {['No Login','Instant Export','Accessible','Free Forever'].map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {/* Example Newsletter Carousel */}
        <ExampleCarousel />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-28 border-t border-b border-white/10 bg-gradient-to-b from-slate-900/40 to-slate-950/60" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-6">
        <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-14 text-center tracking-tight">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {[
            { title: 'Live Section Styling', desc: 'Adjust fonts, borders, colors & backgrounds with instant visual feedback.' },
            { title: 'Smart Headings', desc: 'Auto-suggested common classroom section titles as you type.' },
            { title: 'Drag & Arrange', desc: 'Intuitive panel layout with resizable columns.' },
            { title: 'Emojis & Icons', desc: 'Curated palette for kid-friendly engagement & emphasis.' },
            { title: 'Theme System', desc: 'Holiday & seasonal styles to keep things fresh.' },
            { title: 'Export Suite', desc: 'Download PNG, SVG, PDF or project (.enl) files.' },
          ].map((f, i) => (
            <div key={f.title} className="relative group p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/25 transition overflow-hidden shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent" />
              <div className="relative">
                <div className="mb-4 h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center ring-1 ring-white/20 text-slate-200 text-sm font-semibold" aria-hidden>{i+1}</div>
                {f.title === 'Drag & Arrange' ? (
                  <h3 className="font-semibold mb-2 text-base text-white tracking-tight"><Link href="/builder" className="underline decoration-dotted underline-offset-4 hover:text-sky-300 focus:outline-none">{f.title}</Link></h3>
                ) : (
                  <h3 className="font-semibold mb-2 text-base text-white tracking-tight">{f.title}</h3>
                )}
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueStack() {
  return (
    <section id="value" className="py-32" aria-labelledby="value-heading">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">
        <div>
          <h2 id="value-heading" className="text-3xl font-bold mb-10 tracking-tight">Built for how teachers actually work</h2>
          <ol className="relative ml-2 border-l border-white/10 pl-6 space-y-8">
            {[
              { t: 'Simple', d: 'Focus on content, not design complexity.' },
              { t: 'Engaging', d: 'Colors, emojis & themes boost student attention.' },
              { t: 'Accessible', d: 'Readable fonts & hierarchy tuned for young readers.' },
              { t: 'Reusable', d: 'Load last week’s .enl and update quickly.' },
              { t: 'Shareable', d: 'Export images / PDF for email or print.' },
              { t: 'Teacher‑Centric', d: 'No clutter, no accounts, zero data collection.' }
            ].map(item => (
              <li key={item.t} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 ring-2 ring-slate-900" />
                <h3 className="font-semibold text-sm text-white mb-1 tracking-tight">{item.t}</h3>
                <p className="text-xs text-slate-400 max-w-[46ch] leading-relaxed">{item.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-slate-400 max-w-[50ch]">Want to try it now? Explore the <Link href="/builder" className="text-sky-300 underline decoration-dotted underline-offset-2 hover:text-sky-200">free classroom newsletter builder</Link> and publish today.</p>
        </div>
        <div id="faq" className="grid gap-6">
          <h2 className="text-2xl font-bold tracking-tight">Elementary School Newsletter FAQ</h2>
          {[
            { q: 'Is it free?', a: 'Yes – all core features are available.'},
            { q: 'Do I need an account?', a: 'No account or login required. Open & build instantly.' },
            { q: 'iPad compatible?', a: 'Yes. Panels & drag interactions support touch.' },
            { q: 'How do I share?', a: 'Export PNG / SVG / PDF and embed or send anywhere.' },
          ].map(item => (
            <div key={item.q} className="p-5 rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur shadow-sm">
              <h3 className="font-medium mb-1 text-sm text-white tracking-tight">{item.q}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
          <Link href="/builder" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 text-sm font-semibold shadow hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition mt-4">Start Building <span className="ml-1">→</span></Link>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-36" aria-labelledby="cta-heading">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_60%)] opacity-40" />
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 id="cta-heading" className="text-4xl font-bold mb-6 tracking-tight">Ready to publish your next update?</h2>
        <p className="text-slate-400 mb-10 max-w-[56ch] mx-auto">Compose, style & export in under ten minutes. No barriers. Build an elementary school newsletter your class families actually read.</p>
        <Link href="/builder" className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 text-base font-semibold shadow-[0_8px_34px_-6px_rgba(59,130,246,0.55)] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition">
          Launch the Builder
        </Link>
        <p className="mt-5 text-[11px] text-slate-500">No credit card • No login • v1</p>
      </div>
    </section>
  );
}
