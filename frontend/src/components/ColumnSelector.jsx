// ColumnSelector.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function ColumnSelector({ columns, rows, file }) {
  const [target, setTarget] = useState("");
  const [sensitive, setSensitive] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const targetKeywords = [
  "hired",
  "rejected",
  "selected",
  "approved",
  "accepted",
  "status",
  "outcome",
  "decision",
  "label",
  "result",
  "pass",
  "fail",
];

const sensitiveKeywords = [
  "gender",
  "sex",
  "race",
  "ethnicity",
  "age",
  "nationality",
  "religion",
  "disability",
  "group",
  "demographic",
  "category",
];

const identifierKeywords = [
  "id",
  "candidate_id",
  "candidateid",
  "candidate",
  "user_id",
  "userid",
  "employee_id",
  "employeeid",
  "applicant_id",
  "applicantid",
  "person_id",
  "personid",
  "record_id",
  "recordid",
  "row_id",
  "rowid",
  "uuid",
  "serial",
  "index",
];

const TYPE_META = {
  binary: {
    label: "Binary",
    short: "BIN",
    chipClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    badgeClass: "badge-success",
  },
  numeric: {
    label: "Numeric",
    short: "NUM",
    chipClass: "bg-blue-50 text-blue-700 border-blue-100",
    badgeClass: "badge-info",
  },
  categorical: {
    label: "Categorical",
    short: "CAT",
    chipClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
    badgeClass: "badge-primary",
  },
  text: {
    label: "Text",
    short: "TXT",
    chipClass: "bg-amber-50 text-amber-700 border-amber-100",
    badgeClass: "badge-warning",
  },
  unknown: {
    label: "Unknown",
    short: "UNK",
    chipClass: "bg-slate-50 text-slate-500 border-slate-200",
    badgeClass: "badge",
  },
};

function normalizeColumnName(column) {
  return String(column || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function isIdentifierColumn(column) {
  const normalized = normalizeColumnName(column);

  if (!normalized) return false;

  if (identifierKeywords.includes(normalized)) return true;

  if (normalized === "id") return true;
  if (normalized.endsWith("_id")) return true;
  if (normalized.includes("candidate_id")) return true;
  if (normalized.includes("applicant_id")) return true;
  if (normalized.includes("employee_id")) return true;
  if (normalized.includes("user_id")) return true;
  if (normalized.includes("person_id")) return true;
  if (normalized.includes("record_id")) return true;

  return false;
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

  const handleContinue = async () => {
    if (!target || !sensitive) { alert("Please select both columns"); return; }
    if (!file) { alert("File missing. Please go back and re-upload."); return; }
    
    setLoading(true);
    try {
      const features = columns.filter(c => c !== target && c !== sensitive).join(",");
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_column", target);
      formData.append("sensitive_column", sensitive);
      formData.append("feature_columns", features);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");

      // Pass the API metrics and analysis_id to the dashboard
      navigate("/dashboard", { state: { target, sensitive, rows, analysis_id: data.analysis_id, metrics: data, file, columns } });
    } catch (err) {
      console.error(err);
      alert("Error during analysis: " + err.message);
    } finally {
      setLoading(false);
    }
function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2 15 9l7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
    </svg>
  );
}

function getSuggestedTargets(columns) {
  return columns.filter((column) => {
    if (isIdentifierColumn(column)) return false;

    return targetKeywords.some((keyword) =>
      normalizeColumnName(column).includes(keyword)
    );
  });
}

function getSuggestedSensitive(columns) {
  return columns.filter((column) => {
    if (isIdentifierColumn(column)) return false;

    return sensitiveKeywords.some((keyword) =>
      normalizeColumnName(column).includes(keyword)
    );
  });
}

function getTypeMeta(type) {
  return TYPE_META[type] || TYPE_META.unknown;
}

function ColumnDropdown({
  value,
  onChange,
  options,
  suggestedOptions,
  placeholder,
  disabled = false,
  colMeta,
}) {
  const [open, setOpen] = useState(false);

  const suggestedSet = new Set(suggestedOptions);
  const otherOptions = options.filter((option) => !suggestedSet.has(option));

  const selectedMeta = value ? getTypeMeta(colMeta?.[value]?.type) : null;

  return (
    <div className="relative z-[120] overflow-visible">
      {open && (
        <button
          type="button"
          aria-label="Close dropdown"
          className="fixed inset-0 z-[80] cursor-default bg-transparent"
          onClick={() => setOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => !disabled && setOpen((current) => !current)}
        disabled={disabled}
        className={`relative z-[90] flex min-h-[54px] w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 text-left shadow-sm transition ${
          value
            ? "border-indigo-300 ring-4 ring-indigo-500/10"
            : open
            ? "border-indigo-300 ring-4 ring-indigo-500/10"
            : "border-slate-200 hover:border-indigo-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {value ? (
            <>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
                <DashboardIcon />
              </div>

              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-extrabold text-slate-950">
                  {value}
                </p>

                {selectedMeta && (
                  <p className="mt-0.5 text-xs font-bold text-slate-400">
                    {selectedMeta.label} column
                  </p>
                )}
              </div>
            </>
          ) : (
            <span className="text-sm font-semibold text-slate-400">
              {placeholder}
            </span>
          )}
        </div>

        <span
          className={`shrink-0 text-slate-400 transition ${
            open ? "rotate-180 text-indigo-600" : ""
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-[999] max-h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
          >
            {suggestedOptions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 border-b border-indigo-100 bg-indigo-50 px-4 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-indigo-700">
                  <SparkIcon />
                  Suggested
                </div>

                <div>
                  {suggestedOptions.map((column) => (
                    <DropdownItem
                      key={column}
                      column={column}
                      isSelected={value === column}
                      onSelect={() => {
                        onChange(column);
                        setOpen(false);
                      }}
                      colMeta={colMeta}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="max-h-[250px] overflow-y-auto">
              {suggestedOptions.length > 0 && otherOptions.length > 0 && (
                <div className="border-b border-slate-100 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  All columns
                </div>
              )}

              {otherOptions.map((column) => (
                <DropdownItem
                  key={column}
                  column={column}
                  isSelected={value === column}
                  onSelect={() => {
                    onChange(column);
                    setOpen(false);
                  }}
                  colMeta={colMeta}
                />
              ))}

              {options.length === 0 && (
                <div className="px-4 py-5 text-sm font-semibold text-slate-500">
                  No selectable columns available.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({ column, isSelected, onSelect, colMeta }) {
  const typeMeta = getTypeMeta(colMeta?.[column]?.type);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition ${
        isSelected
          ? "border-indigo-500 bg-indigo-50"
          : "border-transparent hover:bg-slate-50"
      }`}
    >
      <span
        className={`shrink-0 rounded-lg border px-2 py-1 font-mono text-[0.65rem] font-extrabold ${typeMeta.chipClass}`}
      >
        {typeMeta.short}
      </span>

      <span
        className={`min-w-0 flex-1 truncate font-mono text-xs font-bold ${
          isSelected ? "text-indigo-700" : "text-slate-700"
        }`}
      >
        {column}
      </span>

      {isSelected && (
        <span className="shrink-0 text-indigo-600">
          <CheckIcon />
        </span>
      )}
    </button>
  );
}

function MappingCard({
  step,
  title,
  description,
  value,
  onChange,
  options,
  suggestedOptions,
  placeholder,
  colMeta,
  tone = "indigo",
  icon,
}) {
  const isComplete = Boolean(value);

  const toneClasses = {
    indigo: {
      icon: "bg-indigo-50 text-indigo-700 border-indigo-100",
      activeIcon: "bg-indigo-600 text-white shadow-indigo-500/25",
      panel: "from-indigo-50 via-white to-white",
      badge: "badge-primary",
      ring: "border-indigo-300 shadow-indigo-500/10",
    },
    violet: {
      icon: "bg-violet-50 text-violet-700 border-violet-100",
      activeIcon: "bg-violet-600 text-white shadow-violet-500/25",
      panel: "from-violet-50 via-white to-white",
      badge: "badge-primary",
      ring: "border-violet-300 shadow-violet-500/10",
    },
  };

  const toneClass = toneClasses[tone] || toneClasses.indigo;
  const selectedTypeMeta = value ? getTypeMeta(colMeta?.[value]?.type) : null;

  return (
    <motion.div
      layout
      style={{ overflow: "visible" }}
      className={`card card-hover overflow-visible ${
        isComplete ? toneClass.ring : ""
      }`}
    >
      <div
        className={`card-header bg-gradient-to-br ${
          isComplete ? toneClass.panel : "from-slate-50 to-white"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-lg transition ${
              isComplete ? toneClass.activeIcon : toneClass.icon
            }`}
          >
            {isComplete ? <CheckIcon className="h-5 w-5" /> : icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={toneClass.badge}>Field {step}</span>

              {isComplete && <span className="badge badge-success">Mapped</span>}

              {selectedTypeMeta && (
                <span className={selectedTypeMeta.badgeClass}>
                  {selectedTypeMeta.label}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-extrabold tracking-[-0.045em] text-slate-950">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="card-body overflow-visible" style={{ overflow: "visible" }}>
        <label className="label">Select column</label>

        <ColumnDropdown
          value={value}
          onChange={onChange}
          options={options}
          suggestedOptions={suggestedOptions}
          placeholder={placeholder}
          colMeta={colMeta}
        />

        <AnimatePresence>
          {value && colMeta?.[value] && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Sample values
                  </p>

                  <span className="font-mono text-xs font-bold text-slate-400">
                    {colMeta[value].total} unique
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(colMeta[value].values || []).map((sampleValue) => (
                    <span
                      key={String(sampleValue)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[0.72rem] font-bold text-slate-700 shadow-sm"
                    >
                      {String(sampleValue)}
                    </span>
                  ))}

                  {colMeta[value].total > 7 && (
                    <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[0.72rem] font-extrabold text-indigo-700">
                      +{colMeta[value].total - 7} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ReadinessPanel({ target, sensitive, rows }) {
  const ready = Boolean(target && sensitive);

      <button
        onClick={handleContinue}
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "rgba(99,120,255,0.1)" : "linear-gradient(135deg, #6477ff 0%, #818cf8 100%)",
          color: loading ? "#475569" : "#fff",
          border: loading ? "1px solid rgba(99,120,255,0.15)" : "none",
          padding: "13px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: loading ? "none" : "0 4px 20px rgba(100,119,255,0.35)",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
          marginTop: "8px",
        }}
        onMouseEnter={e => { if(!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(100,119,255,0.5)"; } }}
        onMouseLeave={e => { if(!loading) { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(100,119,255,0.35)"; } }}
      >
        {loading ? "Analyzing..." : "Run Fairness Analysis →"}
      </button>
  return (
    <div className={`callout ${ready ? "callout-success" : "callout-warning"}`}>
      <div
        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          ready ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"
        }`}
      >
        {ready ? <CheckIcon className="h-4 w-4" /> : <SparkIcon />}
      </div>

      <div>
        <p className="text-sm font-extrabold">
          {ready ? "Ready to generate dashboard" : "Complete both mappings"}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {ready ? (
            <>
              Target{" "}
              <span className="font-mono font-extrabold text-slate-950">
                {target}
              </span>{" "}
              will be compared across{" "}
              <span className="font-mono font-extrabold text-slate-950">
                {sensitive}
              </span>{" "}
              using {rows.length.toLocaleString()} records.
            </>
          ) : (
            "Select one outcome column and one sensitive attribute before continuing."
          )}
        </p>
      </div>
    </div>
  );
}

export default function ColumnSelector({
  columns,
  rows,
  colMeta = {},
  datasetId = null,
  metadata = null,
}) {
  const [target, setTarget] = useState("");
  const [sensitive, setSensitive] = useState("");

  const navigate = useNavigate();

  const selectableColumns = useMemo(
    () => columns.filter((column) => !isIdentifierColumn(column)),
    [columns]
  );

  const suggestedTargets = useMemo(
    () => getSuggestedTargets(selectableColumns),
    [selectableColumns]
  );

  const suggestedSensitive = useMemo(
    () => getSuggestedSensitive(selectableColumns),
    [selectableColumns]
  );

  const targetOptions = selectableColumns;

  const sensitiveOptions = useMemo(
    () => selectableColumns.filter((column) => column !== target),
    [selectableColumns, target]
  );

  const bothSelected = Boolean(target && sensitive);

  const handleTargetChange = (column) => {
    setTarget(column);

    if (sensitive === column) {
      setSensitive("");
    }
  };

  const handleContinue = () => {
    if (!bothSelected) return;

    navigate("/dashboard", {
      state: {
        source: datasetId ? "backend-dataset" : "local-csv",
        datasetId,
        metadata,
        target,
        sensitive,
        rows,
        columns,
      },
    });
  };

  return (
    <div className="space-y-5 overflow-visible">
      <div className="grid gap-5 overflow-visible xl:grid-cols-2">
        <MappingCard
          step="01"
          title="Target outcome column"
          description="Choose the final decision column, such as hired, approved, selected, status, or outcome. Identifier fields like candidate_id are excluded."
          value={target}
          onChange={handleTargetChange}
          options={targetOptions}
          suggestedOptions={suggestedTargets}
          placeholder="Select outcome column..."
          colMeta={colMeta}
          tone="indigo"
          icon={<TargetIcon />}
        />

        <MappingCard
          step="02"
          title="Sensitive attribute"
          description="Choose the group attribute to compare across, such as gender, age group, ethnicity, department, race, or nationality. Identifier fields are excluded."
          value={sensitive}
          onChange={setSensitive}
          options={sensitiveOptions}
          suggestedOptions={suggestedSensitive.filter((column) => column !== target)}
          placeholder="Select sensitive attribute..."
          colMeta={colMeta}
          tone="violet"
          icon={<GroupIcon />}
        />
      </div>

      {columns.length !== selectableColumns.length && (
        <div className="callout callout-primary">
          <SparkIcon className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="text-sm font-extrabold">
              Identifier columns excluded from mapping
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Columns like{" "}
              <span className="font-mono font-extrabold text-slate-950">
                candidate_id
              </span>
              ,{" "}
              <span className="font-mono font-extrabold text-slate-950">
                user_id
              </span>
              , or{" "}
              <span className="font-mono font-extrabold text-slate-950">
                record_id
              </span>{" "}
              are still counted in the dataset, but they are not valid fairness
              attributes.
            </p>
          </div>
        </div>
      )}

      <ReadinessPanel target={target} sensitive={sensitive} rows={rows} />

      <div className="card">
        <div className="card-body flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="section-eyebrow">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
              Dashboard preparation
            </div>

            <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.05em] text-slate-950">
              Generate your fairness dashboard
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              The next screen will calculate group-level selection rates,
              fairness gaps, risk signals, mitigation guidance, and
              report-ready findings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!bothSelected}
            className="btn btn-primary btn-lg min-w-full disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[260px]"
          >
            <DashboardIcon />
            Generate dashboard
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}