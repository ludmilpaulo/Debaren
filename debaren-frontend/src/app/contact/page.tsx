// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-slate-600 mb-6">We’d love to hear from you. Reach out with your venue or partnership inquiries.</p>

      <form className="grid gap-4 max-w-xl">
        <input type="text" placeholder="Name" className="border p-3 rounded" />
        <input type="email" placeholder="Email" className="border p-3 rounded" />
        <textarea placeholder="Message" rows={4} className="border p-3 rounded" />
        <button className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">Send</button>
      </form>
    </div>
  );
}
