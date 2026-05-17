import { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "./icons";

type FilterProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
};

function Filter({ label, value, placeholder, options, onChange }: FilterProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

export default function SearchBar() {
  const [subject, setSubject] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    console.log("Search", { subject, yearLevel, type });
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-indigo-950/20 ring-1 ring-slate-100 md:p-6">
      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
        <div className="text-left">
          <h3 className="font-display text-lg font-bold leading-tight text-slate-900 md:text-xl">
            Find the right tutor
            <br className="hidden md:block" /> for your needs
          </h3>
        </div>

        <Filter
          label="Subject"
          value={subject}
          placeholder="e.g. Maths, English"
          options={["Maths", "English", "Science", "Physics", "Chemistry", "History"]}
          onChange={setSubject}
        />
        <Filter
          label="Year Level"
          value={yearLevel}
          placeholder="Select year level"
          options={["Years K–4", "Years 5–6", "Years 7–9", "Years 10–12"]}
          onChange={setYearLevel}
        />
        <Filter
          label="Type"
          value={type}
          placeholder="Online or In-Person"
          options={["Online", "In-Person", "Online & In-Person"]}
          onChange={setType}
        />

        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-violet-300/50 transition hover:bg-violet-700 active:scale-[0.98]"
        >
          <SearchIcon className="h-4 w-4" />
          Find Tutors
        </button>
      </div>
    </div>
  );
}
