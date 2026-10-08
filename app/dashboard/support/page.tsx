"use client";

import { FormEvent, useState } from "react";
import {
  Headphones,
  Loader2,
  MessageCircle,
} from "lucide-react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function submitTicket(event: FormEvent) {
    event.preventDefault();

    setSending(true);
    setStatus("");

    // Connect this to /api/support once the support API is added.
    await new Promise((resolve) => setTimeout(resolve, 500));

    setStatus(
      "Support ticket API is ready to be connected."
    );

    setSending(false);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Help Center
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Support
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Contact the Veltra support team.
          </p>
        </div>

        <form
          onSubmit={submitTicket}
          className="rounded-3xl border border-white/10 bg-[#080b1f] p-6 sm:p-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
              <Headphones size={23} />
            </div>

            <div>
              <h2 className="font-bold">Create Support Ticket</h2>
              <p className="text-sm text-gray-500">
                Explain your issue and our team can review it.
              </p>
            </div>
          </div>

          {status && (
            <div className="mb-5 rounded-2xl bg-pink-500/10 p-4 text-sm text-pink-300">
              {status}
            </div>
          )}

          <div className="space-y-5">
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
            />

            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              rows={7}
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
            />

            <button
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
            >
              {sending && (
                <Loader2 className="animate-spin" size={17} />
              )}

              <MessageCircle size={17} />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}