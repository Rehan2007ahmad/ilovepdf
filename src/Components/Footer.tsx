export default function Footer() {
  return (
    <footer className="bg-gray-800 text-yellow-400 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 iLovePDF. All rights reserved.</p>
        <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-yellow-300">Privacy</a>
          <a href="#" className="hover:text-yellow-300">Terms</a>
          <a href="#" className="hover:text-yellow-300">Contact</a>
          <a href="#" className="hover:text-yellow-300">Support</a>
        </div>
      </div>
    </footer>
  );
}
