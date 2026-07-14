import { useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Download,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

type ResumeForm = {
  name: string;
  email: string;
  phone: string;
  role: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  achievements: string;
};

const initialForm: ResumeForm = {
  name: "Ruchita Singh",
  email: "ruchita.singh@learning.hub",
  phone: "",
  role: "Frontend Developer Intern",
  education: "B.Tech CSE, Scope Global Skills University",
  skills: "React, JavaScript, Tailwind CSS, Node.js, MongoDB, DSA",
  projects: "Learning Hub LMS with quizzes, coding practice, assignments, and faculty dashboard.",
  experience: "Built responsive dashboards, integrated REST APIs, and improved UI workflows.",
  achievements: "Solved coding practice problems and completed web development coursework.",
};

function splitItems(value: string) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildSmartSummary(form: ResumeForm) {
  const skills = splitItems(form.skills).slice(0, 4).join(", ");
  const role = form.role.trim() || "student developer";
  return `Motivated ${role} with hands-on experience in ${skills || "modern web technologies"}. Strong interest in building clean user interfaces, solving technical problems, and contributing to practical software projects.`;
}

function buildSmartBullets(form: ResumeForm) {
  const project = form.projects.trim() || "academic and technical projects";
  const experience = form.experience.trim() || "frontend development and problem solving";
  return [
    `Designed and improved ${project}`,
    `Applied ${experience} to deliver practical, user-focused features.`,
    "Collaborated across learning, assignment, quiz, and coding workflows with attention to usability.",
  ];
}

export default function ResumeGenerator() {
  const [form, setForm] = useState<ResumeForm>(initialForm);
  const summary = useMemo(() => buildSmartSummary(form), [form]);
  const bullets = useMemo(() => buildSmartBullets(form), [form]);
  const skills = useMemo(() => splitItems(form.skills), [form.skills]);
  const achievements = useMemo(() => splitItems(form.achievements), [form.achievements]);

  function updateField(field: keyof ResumeForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-8 text-slate-950 md:px-8">
      <section className="mx-auto max-w-[1540px]">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#7c3aed]/10 bg-gradient-to-br from-[#f7f3ff] via-white to-[#eef6ff] p-8 shadow-xl shadow-[#263676]/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#f97316]">AI career studio</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#263676] md:text-5xl">AI Resume Generator</h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Add your details once and get a polished student resume preview with smart summary, skills, projects, and achievement sections.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#263676] px-6 text-sm font-black text-white shadow-lg shadow-[#263676]/20 transition hover:bg-[#7c3aed]"
            >
              <Download className="h-5 w-5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 print:hidden">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#7c3aed]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Resume Details</h2>
                <p className="text-sm font-semibold text-slate-500">AI text updates live as you type.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["name", "Full name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["role", "Target role"],
                ["education", "Education"],
                ["skills", "Skills"],
              ].map(([field, label]) => (
                <label key={field} className="block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
                  <input
                    value={form[field as keyof ResumeForm]}
                    onChange={(event) => updateField(field as keyof ResumeForm, event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-[#7c3aed]/10"
                  />
                </label>
              ))}
            </div>

            {[
              ["projects", "Projects"],
              ["experience", "Experience"],
              ["achievements", "Achievements"],
            ].map(([field, label]) => (
              <label key={field} className="mt-4 block">
                <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
                <textarea
                  value={form[field as keyof ResumeForm]}
                  onChange={(event) => updateField(field as keyof ResumeForm, event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-[#7c3aed]/10"
                />
              </label>
            ))}
          </section>

          {/* Custom print CSS so only the resume preview container itself is visible on print preview */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #print-area, #print-area * {
                visibility: visible;
              }
              #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                border: none !important;
                box-shadow: none !important;
              }
            }
          `}</style>

          <section id="print-area" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 print:border-none print:shadow-none">
            <div className="border-b border-slate-200 pb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-[#111827]">{form.name || "Your Name"}</h2>
                  <p className="mt-2 text-lg font-extrabold text-[#7c3aed]">{form.role || "Target Role"}</p>
                </div>
                <div className="space-y-2 text-sm font-bold text-slate-600">
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#7c3aed]" />{form.email || "email@example.com"}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#7c3aed]" />{form.phone || "Add phone number"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              <article>
                <div className="mb-3 flex items-center gap-2 text-[#263676]">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-black">Professional Summary</h3>
                </div>
                <p className="rounded-2xl bg-[#f6f3ff] p-4 text-sm font-semibold leading-7 text-slate-700">{summary}</p>
              </article>

              <article>
                <div className="mb-3 flex items-center gap-2 text-[#263676]">
                  <BriefcaseBusiness className="h-5 w-5" />
                  <h3 className="text-lg font-black">Projects & Experience</h3>
                </div>
                <ul className="space-y-3">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>

              <div className="grid gap-6 md:grid-cols-2">
                <article>
                  <div className="mb-3 flex items-center gap-2 text-[#263676]">
                    <GraduationCap className="h-5 w-5" />
                    <h3 className="text-lg font-black">Education</h3>
                  </div>
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{form.education || "Add education"}</p>
                </article>

                <article>
                  <div className="mb-3 flex items-center gap-2 text-[#263676]">
                    <Award className="h-5 w-5" />
                    <h3 className="text-lg font-black">Achievements</h3>
                  </div>
                  <ul className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                    {(achievements.length ? achievements : ["Add achievements"]).map((item) => (
                      <li key={item} className="mb-2 last:mb-0">{item}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <article>
                <h3 className="mb-3 text-lg font-black text-[#263676]">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(skills.length ? skills : ["Add skills"]).map((skill) => (
                    <span key={skill} className="rounded-full bg-[#ede9fe] px-4 py-2 text-xs font-black text-[#6d28d9]">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
