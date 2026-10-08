"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  Newspaper,
  Plus,
  Trash2,
} from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadNews() {
    // Connect to your admin news API here.
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function createNews(event: FormEvent) {
    event.preventDefault();

    setSaving(true);

    try {
      // Connect this to POST /api/admin/news
      console.log({
        title,
        slug,
        content,
        imageUrl,
        published,
      });

      setTitle("");
      setSlug("");
      setContent("");
      setImageUrl("");
      setPublished(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Content Management
          </p>

          <h1 className="mt-2 text-3xl font-black">
            News
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Publish platform announcements and updates.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
          <form
            onSubmit={createNews}
            className="h-fit rounded-3xl border border-white/10 bg-[#080b1f] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
                <Plus size={20} />
              </div>

              <h2 className="font-bold">Create News</h2>
            </div>

            <div className="mt-6 space-y-4">
              <Field
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="Platform Update"
              />

              <Field
                label="Slug"
                value={slug}
                onChange={setSlug}
                placeholder="platform-update"
              />

              <Field
                label="Image URL"
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="https://..."
                required={false}
              />

              <label className="block">
                <span className="mb-2 block text-sm text-gray-300">
                  Content
                </span>

                <textarea
                  required
                  rows={7}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) =>
                    setPublished(e.target.checked)
                  }
                />

                Publish immediately
              </label>

              <button
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold"
              >
                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                Publish News
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center">
                <Newspaper
                  className="mx-auto text-gray-500"
                  size={36}
                />

                <p className="mt-4 text-sm text-gray-500">
                  No news articles yet.
                </p>
              </div>
            ) : (
              news.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-bold">
                        {item.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        {item.content}
                      </p>
                    </div>

                    <button className="h-fit rounded-xl bg-red-500/10 p-2.5 text-red-400">
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={14} />
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString("en-PK")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
      />
    </label>
  );
}