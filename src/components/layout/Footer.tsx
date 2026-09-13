import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-fjalla text-xl font-bold tracking-widest uppercase mb-4">Lights Camera Learn</h3>
            <p className="text-gray-600 mb-4 font-libre text-sm">
              Connecting cultures to educate and empower children through the art of filmmaking.
            </p>
            <form className="flex max-w-sm mt-4">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-l-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black uppercase tracking-wider"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/our-story" className="hover:text-black">Our Story</Link></li>
              <li><Link href="/overview" className="hover:text-black">Programs</Link></li>
              <li><Link href="/updates" className="hover:text-black">Updates</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/contactus" className="hover:text-black">Contact Us</Link></li>
              <li><a href="https://www.instagram.com/lights_camera_learn/" target="_blank" rel="noopener noreferrer" className="hover:text-black">Instagram</a></li>
              <li><a href="http://www.facebook.com/10216339393254344" target="_blank" rel="noopener noreferrer" className="hover:text-black">Facebook</a></li>
              <li><a href="https://www.youtube.com/channel/UCOgAxjSAZHaPE2UNngCoQFQ" target="_blank" rel="noopener noreferrer" className="hover:text-black">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lights Camera Learn. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
