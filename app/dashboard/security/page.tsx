import {
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Account Protection
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Security
          </h1>
        </div>

        <div className="space-y-4">
          <SecurityCard
            icon={LockKeyhole}
            title="Password"
            description="Keep your account password private and use a strong password."
            action="Password management API can be added here."
          />

          <SecurityCard
            icon={ShieldCheck}
            title="Session Security"
            description="Your Veltra session is protected using an HTTP-only authentication cookie."
            action="Session protection is active."
          />

          <SecurityCard
            icon={Smartphone}
            title="Two-Factor Authentication"
            description="Additional OTP-based account protection can be enabled in a future update."
            action="Coming soon"
          />
        </div>
      </div>
    </main>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
          <Icon size={22} />
        </div>

        <div>
          <h2 className="font-bold">{title}</h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {description}
          </p>

          <p className="mt-4 text-xs font-semibold text-emerald-400">
            {action}
          </p>
        </div>
      </div>
    </div>
  );
}