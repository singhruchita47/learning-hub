import { useEffect, useState } from "react";
import { CalendarDays, FileText, MessageSquareText, Upload, Loader, CheckCircle2 } from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";
import { uploadToCloudinary } from "@/lib/cloudinary";

function formatDate(date: string) {
  try {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

export default function StudentAssignmentsPanel({ filter = "All" }: { filter?: string }) {
  const { assignments, reloadAssignments, submitAssignment } = useAcademic();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<Record<string, string>>({});

  useEffect(() => {
    void reloadAssignments();
  }, [reloadAssignments]);

  const handleUpload = async (assignmentId: string, file: File) => {
    setUploadingId(assignmentId);
    setUploadError((prev) => ({ ...prev, [assignmentId]: "" }));

    try {
      const secureUrl = await uploadToCloudinary(file);
      await submitAssignment(assignmentId, file.name, secureUrl, notes[assignmentId] ?? "");
    } catch (error) {
      setUploadError((prev) => ({
        ...prev,
        [assignmentId]: error instanceof Error ? error.message : "Cloudinary upload failed",
      }));
    } finally {
      setUploadingId(null);
    }
  };

  const filteredAssignments = assignments.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !item.submittedFileName;
    if (filter === "Submitted") return item.submittedFileName && !item.feedback;
    if (filter === "Graded") return !!item.feedback;
    return true;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredAssignments.length > 0 ? (
        filteredAssignments.map((assignment) => {
          let statusText = "Pending";
          let statusColor = "bg-amber-50 text-amber-600";
          let iconBg = "bg-violet-50 text-violet-600";
          
          if (assignment.submittedFileName) {
            statusText = "Submitted";
            statusColor = "bg-blue-50 text-blue-600";
          }
          if (assignment.feedback) {
            statusText = "Graded";
            statusColor = "bg-emerald-50 text-emerald-600";
            iconBg = "bg-emerald-50 text-emerald-600";
          }

          return (
            <article
              key={assignment.id}
              className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100/50 flex flex-col gap-4 transition hover:shadow-md animate-in fade-in duration-300"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                    {statusText}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> {formatDate(assignment.dueDate)}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-base font-extrabold text-slate-800 leading-snug">{assignment.title}</h3>
                <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-500 line-clamp-2">
                  {assignment.description}
                </p>
                
                {assignment.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 p-1">
                    <img src={assignment.imageUrl} alt="Reference" className="w-full h-16 object-contain rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {assignment.submittedFileName ? (
                  <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-700 flex flex-col gap-1 border border-slate-100">
                    <div className="flex items-center gap-1.5 font-black text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Uploaded Successfully</span>
                    </div>
                    {assignment.submittedFileUrl ? (
                      <a href={assignment.submittedFileUrl} target="_blank" rel="noreferrer" className="underline text-slate-600 font-bold truncate hover:text-slate-800">
                        {assignment.submittedFileName}
                      </a>
                    ) : (
                      <span className="truncate">{assignment.submittedFileName}</span>
                    )}
                  </div>
                ) : null}

                {assignment.feedback && (
                  <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4 border border-violet-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-black text-violet-700">
                        <MessageSquareText className="h-4 w-4" /> Faculty Feedback
                      </span>
                      {assignment.marks !== undefined && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                          🎯 {assignment.marks} / 100
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-600 italic leading-relaxed">
                      "{assignment.feedback}"
                    </p>
                  </div>
                )}

                {!assignment.feedback && (
                  <div className="flex gap-2.5 mt-1">
                    <input
                      value={notes[assignment.id] ?? ""}
                      onChange={(e) => setNotes(c => ({ ...c, [assignment.id]: e.target.value }))}
                      placeholder="Add note..."
                      className="flex-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 transition"
                    />
                    <label className="flex h-11 px-4 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-violet-600 text-xs font-black text-white hover:bg-violet-700 shadow-sm transition-all shrink-0">
                      {uploadingId === assignment.id ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadingId === assignment.id ? "..." : assignment.submittedFileName ? "Re-upload" : "Upload"}
                      <input
                        type="file"
                        className="hidden"
                        disabled={uploadingId === assignment.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleUpload(assignment.id, file);
                        }}
                      />
                    </label>
                  </div>
                )}
                
                {uploadError[assignment.id] && (
                  <p className="text-[10px] font-bold text-red-600 text-center">{uploadError[assignment.id]}</p>
                )}
              </div>
            </article>
          );
        })
      ) : (
        <div className="col-span-full py-16 text-center">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-slate-400 font-extrabold text-sm">No assignments found in this section.</p>
        </div>
      )}
    </div>
  );
}
