"use client";

export default function NewsletterForm() {
  return (
    <form className="max-w-md mx-auto flex gap-3 reveal" onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="Enter your email" className="flex-1 bg-background border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-primary" />
      <button className="bg-primary text-background px-6 py-2 rounded hover:bg-white transition-colors cursor-hover">Subscribe</button>
    </form>
  );
}
