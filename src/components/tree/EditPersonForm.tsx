"use client";

import { updatePerson } from "@/lib/actions/person";
import { useState } from "react";

type PersonData = {
  id: string;
  firstName: string;
  lastName: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  birthPlace: string | null;
  gender: string | null;
  bio: string | null;
  isLiving: boolean;
};

function toDateInputValue(date: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function EditPersonForm({ person }: { person: PersonData }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <form
      action={async (formData) => {
        setError("");
        setSuccess(false);
        const result = await updatePerson(person.id, formData);
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      }}
      className="flex flex-col gap-4"
    >
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Profile updated successfully
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={person.firstName}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={person.lastName ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="gender" className="mb-1 block text-sm font-medium">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          defaultValue={person.gender ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="">Select...</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthDate" className="mb-1 block text-sm font-medium">
            Birth date
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={toDateInputValue(person.birthDate)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="deathDate" className="mb-1 block text-sm font-medium">
            Death date
          </label>
          <input
            id="deathDate"
            name="deathDate"
            type="date"
            defaultValue={toDateInputValue(person.deathDate)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="birthPlace" className="mb-1 block text-sm font-medium">
          Birth place
        </label>
        <input
          id="birthPlace"
          name="birthPlace"
          type="text"
          defaultValue={person.birthPlace ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={person.bio ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isLiving"
          name="isLiving"
          type="checkbox"
          defaultChecked={person.isLiving}
          value="true"
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="isLiving" className="text-sm font-medium">
          Person is living
        </label>
      </div>

      <button
        type="submit"
        className="w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
      >
        Save changes
      </button>
    </form>
  );
}
