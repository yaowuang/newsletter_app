// src/components/footer.tsx

export default function Footer() {
  return (
    <footer className="relative z-10 py-10 border-t border-white/10 text-center text-sm text-slate-400" style={{ paddingBottom: '100px' }}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} ElementarySchoolNewsletters.com · Built for teachers & PTAs · Contact Us: <a href="mailto:admin@elementaryschoolnewsletters.com" className="text-blue-500 hover:underline">admin@elementaryschoolnewsletters.com</a>
        </p>
      </div>
    </footer>
  );
}
