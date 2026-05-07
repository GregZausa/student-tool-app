import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

const SelectBox = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label = "",
  disabled = false,
  className = "",
  required = false,
  searchable = false,
  isDark,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filtered = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`
          group w-full flex items-center justify-between gap-3
          px-4 py-3 rounded-xl text-sm font-medium
          border transition-all duration-200 outline-none
          ${
            disabled
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : isOpen
                ? `ring-4  ${isDark ? "bg-slate-800 border-slate-700 text-slate-50 ring-slate-600" : "bg-white border-slate-800/50  ring-indigo-100 text-slate-800 "} shadow-sm`
                : `${isDark ? "bg-slate-800 text-slate-100 border-slate-700" : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"} hover:shadow-sm shadow-xs`
          }
        `}
      >
        <span
          className={
            selectedOption
              ? `${isDark ? "" : "text-slate-800"}`
              : "text-slate-400"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown
          size={15}
          className={`shrink-0 transition-all duration-200 ${
            isOpen
              ? `${isDark ? "" : "text-slate-800"} rotate-180`
              : `${isDark ? "group-hover:text-slate-50 text-slate-200" : "text-slate-400 group-hover:text-slate-800"}`
          }`}
        />
      </button>
      {isOpen && !disabled && (
        <div
          className={`
            absolute z-50 mt-2 w-full
            border
            ${isDark ? "bg-slate-800 border-slate-600 text-slate-50" : "bg-white border-slate-200"}
            rounded-xl shadow-xl shadow-slate-200/70
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-150
          `}
        >
          {searchable && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
              <Search size={13} className="text-slate-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
              />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div
                className={`px-4 py-3 text-sm ${isDark ? "text-slate-200" : "text-slate-600"} text-center`}
              >
                No results found
              </div>
            ) : (
              filtered.map((option) => {
                const isSelected = value === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      flex items-center justify-between
                      px-4 py-2.5 text-sm cursor-pointer
                      transition-colors duration-100
                      ${
                        isSelected
                          ? `${isDark ? "bg-slate-700 text-slate-50" : "bg-indigo-50 text-slate-500"} font-semibold`
                          : `${isDark ? "text-slate-200 hover:bg-slate-500" : "text-slate-700 hover:bg-slate-50"}`
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check
                        size={14}
                        className={`${isDark ? "text-slate-300" : "text-slate-500 shrink-0"}`}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectBox;
