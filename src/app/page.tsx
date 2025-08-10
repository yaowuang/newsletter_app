"use client";

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-slate-100">
      {/* Decorative background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_60%)]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-[0.07] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl mt-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
              <rect x="6" y="14" width="16" height="36" rx="2" className="fill-blue-500" />
              <rect x="24" y="10" width="16" height="40" rx="2" className="fill-purple-500" />
              <rect x="42" y="18" width="16" height="32" rx="2" className="fill-pink-500" />
              <rect x="9" y="20" width="10" height="2" className="fill-white/90" />
              <rect x="27" y="16" width="10" height="2" className="fill-white/90" />
              <rect x="45" y="24" width="10" height="2" className="fill-white/90" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-lg sm:text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Elementary School Newsletters</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#goals" className="hover:text-white transition">Goals</a>
          <a href="#benefits" className="hover:text-white transition">Benefits</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/builder" className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:from-blue-500 hover:to-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60">Launch Builder →</Link>
        </div>
      </header>
      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-16 pb-28 md:pt-28 md:pb-40">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Build Joyful <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 text-slate-900 px-2 py-1 rounded -rotate-1 shadow-sm">Elementary</span>
                  <span className="absolute inset-0 bg-yellow-300/40 blur-sm rounded" />
                </span> Newsletters Fast
              </h1>
              <p className="text-lg md:text-xl text-slate-300/90 mb-8 max-w-xl leading-relaxed">A dark-mode first, teacher-friendly builder: drag blocks, style sections, add emojis, and export—no account, no clutter, just results.</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <Link href="/builder" className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3 text-base font-semibold shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition">Get Started Free</Link>
                <a href="#features" className="inline-flex items-center rounded-lg px-7 py-3 text-base font-medium bg-white/10 backdrop-blur border border-white/15 text-slate-200 hover:bg-white/15 transition">Explore Features</a>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-wide font-medium text-slate-400">
                {['No Login','Instant Export','Accessible Fonts','Beta Free','Mobile Friendly'].map(t => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div className="relative">
              <div className="group aspect-[4/3] w-full rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-slate-800/40 backdrop-blur-xl shadow-2xl flex items-center justify-center text-slate-500 text-sm overflow-visible">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                <Image src="/builder-screenshot.png" alt="Newsletter Builder Screenshot" fill priority className="object-cover object-top rounded-2xl" />
                <div className="absolute -top-6 -left-6 bg-slate-900/95 text-slate-100 rounded-lg border border-white/15 shadow-lg p-3 text-[10px] max-w-[160px] rotate-[-3deg]">Drag sections & change themes.</div>
                <div className="absolute -bottom-5 -right-4 bg-slate-900/95 text-slate-100 rounded-lg border border-white/15 shadow-lg p-3 text-[10px] max-w-[170px] rotate-2">Export high‑quality images & PDF.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-28 border-t border-b border-white/10 bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-14 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Live Section Styling', desc: 'Adjust fonts, borders, colors & backgrounds with instant visual feedback.' },
                { title: 'Smart Headings', desc: 'Auto-suggested common classroom section titles as you type.' },
                { title: 'Drag & Arrange', desc: 'Intuitive panel layout with resizable columns.' },
                { title: 'Emojis & Icons', desc: 'Curated palette for kid-friendly engagement & emphasis.' },
                { title: 'Theme System', desc: 'Holiday & seasonal styles to keep things fresh.' },
                { title: 'Export Suite', desc: 'Download PNG, SVG, PDF or project (.enl) files.' },
              ].map(f => (
                <div key={f.title} className="relative group p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" />
                  <h3 className="relative font-semibold mb-2 text-base text-white">{f.title}</h3>
                  <p className="relative text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals */}
        <section id="goals" className="py-28">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14">
            <div>
              <h2 className="text-3xl font-bold mb-8">Project Goals</h2>
              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  'Simplify weekly classroom & PTA newsletter creation',
                  'Markdown editing + auto layout (planned)',
                  'Seasonal / holiday themes',
                  'Delightful, student-friendly visuals',
                  'Rich exports (PNG/SVG now, PDF added)',
                  'Engaging emojis, icons & clipart',
                  'Keyboard & power-user workflow',
                  'Reusable layouts & components'
                ].map(g => <li key={g} className="flex gap-2"><span className="text-blue-400">•</span><span>{g}</span></li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-5">Non-Goals (MVP)</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  'Full CMS / multi-teacher portal',
                  'Automated student data handling',
                  'Offline-first editing (post-MVP)',
                  'Native mobile app (future)' 
                ].map(n => <li key={n} className="flex gap-2"><span className="text-slate-600">–</span><span>{n}</span></li>)}
              </ul>
              <div className="mt-6 p-4 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">Iterative roadmap—planned features clearly labeled.</div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-28 border-t border-b border-white/10 bg-gradient-to-b from-slate-950/60 to-slate-900/40">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-8">Why Teachers Use It</h2>
              <ul className="space-y-5 text-slate-300 text-sm">
                <li><strong className="text-white">Save Time:</strong> Skip generic design tools & focus on content.</li>
                <li><strong className="text-white">Consistent Style:</strong> Themes maintain visual coherence.</li>
                <li><strong className="text-white">Student Friendly:</strong> Accessible fonts & hierarchy tuned for young readers.</li>
                <li><strong className="text-white">Flexible Sharing:</strong> Print, email, or post exported images/PDF.</li>
                <li><strong className="text-white">Reusability:</strong> Load last week’s .enl and update quickly.</li>
              </ul>
              <Link href="/builder" className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 text-sm font-semibold shadow mt-10 hover:from-blue-500 hover:to-indigo-500 transition">Start Building →</Link>
            </div>
            <div className="grid gap-6">
              {[
                { q: 'Is it free?', a: 'Yes, the beta is free. Core exports & templates included.' },
                { q: 'Account needed?', a: 'No. Open the builder and begin immediately.' },
                { q: 'iPad compatible?', a: 'Yes. Panels & drag interactions support touch.' },
                { q: 'How do I share?', a: 'Export PNG/SVG/PDF and attach or embed anywhere.' },
              ].map(item => (
                <div key={item.q} className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur">
                  <h3 className="font-medium mb-1 text-sm text-white">{item.q}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-5">Ready to publish your next update?</h2>
            <p className="text-slate-400 mb-10">Compose, style & export in under ten minutes. No barriers.</p>
            <Link href="/builder" className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 text-base font-semibold shadow-lg hover:from-blue-500 hover:to-purple-500 transition">Launch the Builder</Link>
            <p className="mt-5 text-[11px] text-slate-500">No credit card • No login • Beta v1</p>
          </div>
        </section>
      </main>
      <footer className="relative z-10 py-10 border-t border-white/10 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} ElementarySchoolNewsletters.com · Built for teachers & PTAs
      </footer>
    </div>
  );
}
