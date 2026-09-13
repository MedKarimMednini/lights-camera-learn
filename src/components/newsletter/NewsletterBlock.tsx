"use client";

export default function NewsletterBlock() {
  return (
    <div className="bg-gray-100 py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="font-fjalla text-2xl uppercase tracking-widest mb-4">Subscribe</h3>
        <p className="font-libre text-gray-600 mb-8">Sign up to receive news and updates.</p>
        
        <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert("Newsletter functionality will be implemented in a future phase."); }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            className="flex-1 border border-gray-300 p-3 focus:outline-none focus:border-black"
          />
          <button 
            type="submit" 
            className="bg-black text-white px-8 py-3 font-fjalla uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
