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
    <div className="flex flex-col gap-3">
      {filteredAssignments.length > 0 ? (
        filteredAssignments.map((assignment) => {
          // Determine status text & colors
          let statusText = "Pending";
          let statusColor = "bg-amber-50 text-amber-700 border-amber-100";
          if (assignment.submittedFileName) {
            statusText = "Submitted";
            statusColor = "bg-blue-50 text-blue-700 border-blue-100";
          }
          if (assignment.feedback) {
            statusText = "Graded";
            statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
          }

          return (
            <article
              key={assignment.id}
              className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between transition hover:shadow-md animate-in fade-in duration-300"
            >
              {/* Left Side: Info */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                      {statusText}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-slate-500">
                      {assignment.courseCode || "CSE"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-violet-400" />
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-900 mt-2">{assignment.title}</h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500 line-clamp-2 max-w-3xl">
                  {assignment.description}
                </p>

                {assignment.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 p-1 w-fit">
                    <img
                      src={assignment.imageUrl}
                      alt="Reference attachment"
                      className="object-contain rounded max-h-[60px]"
                    />
                  </div>
                )}
              </div>

              {/* Right Side: Actions & Status */}
              <div className="md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 flex flex-col justify-center space-y-2">
                {assignment.submittedFileName && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-xs font-bold text-emerald-700 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-black">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Uploaded Successfully</span>
                    </div>
                    {assignment.submittedFileUrl ? (
                      <a href={assignment.submittedFileUrl} target="_blank" rel="noreferrer" className="underline text-emerald-650 font-black truncate hover:text-emerald-800">
                        {assignment.submittedFileName}
                      </a>
                    ) : (
                      <span className="truncate font-semibold">{assignment.submittedFileName}</span>
                    )}
                  </div>
                )}

                {assignment.feedback && (
                  <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-violet-750">
                        <MessageSquareText className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                        Feedback
                      </p>
                      {assignment.marks !== undefined && (
                        <span className="text-[10px] font-black text-slate-800 bg-white border border-violet-100 rounded px-2 py-0.5">
                          {assignment.marks} Marks
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold leading-relaxed text-slate-500 italic line-clamp-2">"{assignment.feedback}"</p>
                  </div>
                )}

                {!assignment.feedback && (
                  <>
                    <textarea
                      value={notes[assignment.id] ?? ""}
                      onChange={(event) => setNotes((current) => ({ ...current, [assignment.id]: event.target.value }))}
                      placeholder="Add note..."
                      rows={1}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition"
                    />

                    <label className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-[11px] font-black text-white hover:bg-slate-800 transition duration-200">
                      {uploadingId === assignment.id ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {uploadingId === assignment.id ? "Uploading..." : assignment.submittedFileName ? "Replace File" : "Upload File"}
                      <input
                        type="file"
                        className="hidden"
                        disabled={uploadingId === assignment.id}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void handleUpload(assignment.id, file);
                        }}
                      />
                    </label>
                  </>
                )}
                
                {uploadError[assignment.id] && (
                  <p className="text-[10px] font-bold text-red-600 mt-0.5">{uploadError[assignment.id]}</p>
                )}
              </div>
            </article>
          );
        })
      ) : (
        <div className="py-12 text-center text-slate-400 font-bold text-sm border border-dashed border-slate-200 rounded-2xl bg-white">
          No assignments found.
        </div>
      )}
    </div>
  );
}
