"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Edit3,
  Loader2,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  status:
    | "ACTIVE"
    | "BLOCKED"
    | "SUSPENDED";
  balance: string;
  createdAt: string | number | {
    epochMilliseconds: number;
  };
};

type FormState = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: "USER" | "ADMIN";
  status:
    | "ACTIVE"
    | "BLOCKED"
    | "SUSPENDED";
};

const emptyForm: FormState = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  role: "USER",
  status: "ACTIVE",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function loadUsers() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/users",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load users."
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowModal(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);

    setForm({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.role,
      status: user.status,
    });

    setMessage("");
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function saveUser(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";

      const method = editingUser
        ? "PATCH"
        : "POST";

      const body: Record<string, unknown> = {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status,
      };

      if (
        form.password.trim()
      ) {
        body.password =
          form.password;
      }

      if (
        !editingUser &&
        !form.password.trim()
      ) {
        setError(
          "Password is required when creating a user."
        );
        setSaving(false);
        return;
      }

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        });

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to save user."
        );
        return;
      }

      setMessage(
        editingUser
          ? "User updated successfully."
          : "User created successfully."
      );

      await loadUsers();

      setTimeout(() => {
        closeModal();
      }, 500);
    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(
    user: User
  ) {
    const confirmed =
      window.confirm(
        `Deactivate @${user.username}?`
      );

    if (!confirmed) return;

    try {
      const response =
        await fetch(
          `/api/admin/users/${user.id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Unable to deactivate user."
        );
        return;
      }

      await loadUsers();
    } catch {
      alert(
        "Something went wrong."
      );
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-pink-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Users
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create, edit and manage Veltra users.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {error && !showModal && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-gray-500">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Contact
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Balance
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(
                    (user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/5 hover:bg-white/[0.015]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
                              <UserRound
                                size={17}
                              />
                            </div>

                            <div>
                              <p className="font-semibold">
                                {
                                  user.fullName
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                @
                                {
                                  user.username
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-1 text-xs text-gray-400">
                            <p className="flex items-center gap-2">
                              <Mail
                                size={13}
                              />
                              {
                                user.email
                              }
                            </p>

                            <p className="flex items-center gap-2">
                              <Phone
                                size={13}
                              />
                              {
                                user.phone ||
                                  "-"
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 text-xs font-semibold">
                            {user.role ===
                              "ADMIN" && (
                              <ShieldCheck
                                size={
                                  14
                                }
                                className="text-pink-400"
                              />
                            )}

                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          Rs.{" "}
                          {Number(
                            user.balance
                          ).toLocaleString(
                            "en-PK"
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <Status
                            status={
                              user.status
                            }
                          />
                        </td>

                        <td className="px-6 py-5 text-xs text-gray-500">
                          {formatDate(
                            user.createdAt
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openEdit(
                                  user
                                )
                              }
                              className="rounded-xl bg-white/5 p-2.5 text-gray-300 hover:bg-white/10"
                              title="Edit user"
                            >
                              <Edit3
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              onClick={() =>
                                deleteUser(
                                  user
                                )
                              }
                              className="rounded-xl bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"
                              title="Deactivate user"
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#080b1f] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-pink-400">
                  Administration
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {editingUser
                    ? "Edit User"
                    : "Create User"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl bg-white/5 p-2 text-gray-400 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {message && (
              <div className="mb-5 rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-400">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-2xl bg-red-400/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={saveUser}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  value={
                    form.fullName
                  }
                  onChange={(value) =>
                    setForm({
                      ...form,
                      fullName:
                        value,
                    })
                  }
                  placeholder="Full Name"
                />

                <Field
                  label="Username"
                  value={
                    form.username
                  }
                  onChange={(value) =>
                    setForm({
                      ...form,
                      username:
                        value,
                    })
                  }
                  placeholder="username"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      email: value,
                    })
                  }
                  placeholder="user@example.com"
                  type="email"
                />

                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      phone: value,
                    })
                  }
                  placeholder="+92..."
                />
              </div>

              <Field
                label={
                  editingUser
                    ? "New Password (optional)"
                    : "Password"
                }
                value={
                  form.password
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    password:
                      value,
                  })
                }
                placeholder={
                  editingUser
                    ? "Leave empty to keep current password"
                    : "Minimum 8 characters"
                }
                type="password"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Role"
                  value={form.role}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      role: value as
                        | "USER"
                        | "ADMIN",
                    })
                  }
                  options={[
                    {
                      value: "USER",
                      label: "User",
                    },
                    {
                      value: "ADMIN",
                      label: "Admin",
                    },
                  ]}
                />

                <SelectField
                  label="Status"
                  value={
                    form.status
                  }
                  onChange={(value) =>
                    setForm({
                      ...form,
                      status:
                        value as
                          | "ACTIVE"
                          | "BLOCKED"
                          | "SUSPENDED",
                    })
                  }
                  options={[
                    {
                      value:
                        "ACTIVE",
                      label:
                        "Active",
                    },
                    {
                      value:
                        "BLOCKED",
                      label:
                        "Blocked",
                    },
                    {
                      value:
                        "SUSPENDED",
                      label:
                        "Suspended",
                    },
                  ]}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl bg-white/5 px-5 py-3.5 text-sm font-bold hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {editingUser
                    ? "Save Changes"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <input
        required={
          type !== "password" ||
          false
        }
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
              className="bg-[#080b1f]"
            >
              {option.label}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function Status({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    ACTIVE:
      "bg-emerald-400/10 text-emerald-400",
    BLOCKED:
      "bg-red-400/10 text-red-400",
    SUSPENDED:
      "bg-yellow-400/10 text-yellow-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-white/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(
  value: User["createdAt"]
) {
  if (
    typeof value === "object" &&
    value &&
    "epochMilliseconds" in value
  ) {
    return new Date(
      value.epochMilliseconds
    ).toLocaleDateString(
      "en-PK"
    );
  }

  return new Date(
    value
  ).toLocaleDateString(
    "en-PK"
  );
}