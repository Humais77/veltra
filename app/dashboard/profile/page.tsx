"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
type Profile = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  emailVerified: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [fullName, setFullName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [
    profileMessage,
    setProfileMessage,
  ] = useState("");

  const [
    profileError,
    setProfileError,
  ] = useState("");

  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState("");

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response =
          await fetch(
            "/api/profile",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setProfileError(
            data.error ||
            "Unable to load profile."
          );
          return;
        }

        const user =
          data.user;

        setProfile(user);
        setFullName(
          user.fullName
        );
        setUsername(
          user.username
        );
        setEmail(user.email);
        setPhone(user.phone);
      } catch {
        setProfileError(
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function updateProfile(
    event: FormEvent
  ) {
    event.preventDefault();

    setSavingProfile(true);
    setProfileMessage("");
    setProfileError("");

    try {
      const response =
        await fetch(
          "/api/profile",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              fullName,
              username,
              phone,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setProfileError(
          data.error ||
          "Unable to update profile."
        );
        return;
      }

      setProfile(
        data.user
      );

      setFullName(
        data.user.fullName
      );

      setUsername(
        data.user.username
      );

      setPhone(
        data.user.phone
      );

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch {
      setProfileError(
        "Something went wrong."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(
    event: FormEvent
  ) {
    event.preventDefault();

    setSavingPassword(true);
    setPasswordMessage("");
    setPasswordError("");

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );
      setSavingPassword(false);
      return;
    }

    try {
      const response =
        await fetch(
          "/api/profile/password",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
              confirmPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setPasswordError(
          data.error ||
          "Unable to change password."
        );
        return;
      }

      setPasswordMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError(
        "Something went wrong."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-black">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account information and password.
          </p>
        </div>

        {/* PROFILE */}
        <form
          onSubmit={updateProfile}
          className="rounded-3xl border border-white/10 bg-[#080b1f] p-6 sm:p-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <div className="rounded-2xl bg-pink-500/10 p-4 text-pink-400">
              <UserRound size={26} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Profile Information
              </h2>

              <p className="text-sm text-gray-500">
                Update your personal account information.
              </p>
            </div>
          </div>

          {profileMessage && (
            <Message
              type="success"
              message={
                profileMessage
              }
            />
          )}

          {profileError && (
            <Message
              type="error"
              message={
                profileError
              }
            />
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Username"
              value={username}
              onChange={
                setUsername
              }
            />

            <Field
              label="Full Name"
              value={fullName}
              onChange={
                setFullName
              }
            />

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email
              </label>

              <div className="flex items-center gap-3">
                <input
                  value={profile?.email ?? ""}
                  readOnly
                  className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm"
                />

                {profile?.emailVerified ? (
                  <span className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400">
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/verify-email?email=${encodeURIComponent(
                          profile?.email ?? ""
                        )}`
                      )
                    }
                    className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-400"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>

            <Field
              label="Phone"
              value={phone}
              onChange={
                setPhone
              }
            />
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-gray-500">
            <Lock size={14} />

            Email address cannot be changed from the profile page.
          </div>

          <button
            disabled={
              savingProfile
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
          >
            {savingProfile && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            Save Profile
          </button>
        </form>

        {/* PASSWORD */}
        <form
          onSubmit={changePassword}
          className="mt-6 rounded-3xl border border-white/10 bg-[#080b1f] p-6 sm:p-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <div className="rounded-2xl bg-purple-500/10 p-4 text-purple-400">
              <KeyRound
                size={26}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Password
              </h2>

              <p className="text-sm text-gray-500">
                Change your account password securely.
              </p>
            </div>
          </div>

          {passwordMessage && (
            <Message
              type="success"
              message={
                passwordMessage
              }
            />
          )}

          {passwordError && (
            <Message
              type="error"
              message={
                passwordError
              }
            />
          )}

          <div className="space-y-5">
            <Field
              label="Current Password"
              value={
                currentPassword
              }
              onChange={
                setCurrentPassword
              }
              type="password"
            />

            <Field
              label="New Password"
              value={
                newPassword
              }
              onChange={
                setNewPassword
              }
              type="password"
            />

            <Field
              label="Confirm New Password"
              value={
                confirmPassword
              }
              onChange={
                setConfirmPassword
              }
              type="password"
            />
          </div>

          <button
            disabled={
              savingPassword
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
          >
            {savingPassword && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            Change Password
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  icon,
}: {
  label: string;
  value: string;
  onChange?: (
    value: string
  ) => void;
  type?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}

        <input
          required
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange?.(
              event.target.value
            )
          }
          className={`w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none ${icon
              ? "pl-11"
              : ""
            } ${disabled
              ? "cursor-not-allowed opacity-50"
              : ""
            } focus:border-pink-500/50`}
        />
      </div>
    </label>
  );
}

function Message({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`mb-6 flex items-center gap-2 rounded-2xl p-4 text-sm ${type === "success"
          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
          : "border border-red-400/20 bg-red-400/10 text-red-400"
        }`}
    >
      <CheckCircle2 size={17} />
      {message}
    </div>
  );
}