import {
  CalendarDays,
  Newspaper,
} from "lucide-react";

import { db } from "@/src/prisma/db";

export default async function NewsPage() {
  const news = await db.orm.public.News
    .where({ published: true })
    .orderBy((item) => item.createdAt.desc())
    .all();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Updates
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Latest News
          </h1>
        </div>

        {news.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center">
            <Newspaper
              className="mx-auto text-gray-500"
              size={36}
            />

            <h2 className="mt-4 font-bold">
              No news available
            </h2>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={14} />
                    {new Date(item.createdAt.epochMilliseconds).toLocaleDateString("en-PK")}
                  </div>

                  <h2 className="mt-4 text-xl font-bold">
                    {item.title}
                  </h2>

                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                    {item.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}