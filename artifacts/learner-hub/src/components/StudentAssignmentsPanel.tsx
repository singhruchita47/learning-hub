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
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
              className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100/60 flex flex-col justify-between gap-4 transition hover:shadow-md animate-in fade-in duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                      {statusText}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-slate-500">
                      {assignment.courseCode || "CSE"}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-800 mt-3.5 leading-snug">{assignment.title}</h3>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-400">
                  {assignment.description}
                </p>

                {/* Render attached reference image */}
                {assignment.imageUrl && (
                  <div className="mt-3.5 rounded-2xl overflow-hidden border border-slate-100 max-h-[160px] bg-slate-50 shadow-inner p-1">
                    <img
                      src={assignment.imageUrl}
                      alt="Reference attachment"
                      className="w-full h-full object-contain rounded-xl max-h-[145px]"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CalendarDays className="h-4 w-4 text-violet-500" />
                  Due {formatDate(assignment.dueDate)}
                </div>

                {assignment.submittedFileName && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs font-bold text-emerald-700 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-black">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Uploaded Successfully</span>
                    </div>
                    {assignment.submittedFileUrl ? (
                      <a
                        href={assignment.submittedFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-emerald-650 font-black mt-0.5 truncate hover:text-emerald-800"
                      >
                        File: {assignment.submittedFileName}
                      </a>
                    ) : (
                      <span className="truncate font-semibold">File: {assignment.submittedFileName}</span>
                    )}
                    {assignment.studentNote && (
                      <p className="mt-1 text-slate-500 font-semibold italic">" {assignment.studentNote} "</p>
                    )}
                  </div>
                )}

                {assignment.feedback && (
                  <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-3 space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-black text-violet-750">
                      <MessageSquareText className="h-4 w-4 shrink-0 text-violet-500" />
                      Faculty Feedback
                    </p>
                    {assignment.marks !== undefined && (
                      <span className="inline-block text-xs font-black text-slate-800 bg-white border border-violet-100 rounded-lg px-2.5 py-1">
                        Score: <span className="text-violet-600">{assignment.marks}</span> marks
                      </span>
                    )}
                    <p className="text-xs font-semibold leading-relaxed text-slate-500 italic">"{assignment.feedback}"</p>
                  </div>
                )}

                {!assignment.feedback && (
                  <>
                    <textarea
                      value={notes[assignment.id] ?? ""}
                      onChange={(event) => setNotes((current) => ({ ...current, [assignment.id]: event.target.value }))}
                      placeholder="Add a note for faculty..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 transition"
                    />

                    <label className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-violet-600 text-xs font-black text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition duration-200">
                      {uploadingId === assignment.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploadingId === assignment.id ? "Uploading..." : assignment.submittedFileName ? "Replace Submission" : "Upload Submission"}
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
                  <p className="text-xs font-bold text-red-600 mt-1">{uploadError[assignment.id]}</p>
                )}
              </div>
            </article>
          );
        })
      ) : (
        <div className="col-span-full py-16 text-center text-slate-400 font-extrabold text-sm border border-dashed border-slate-200 rounded-3xl bg-white">
          No assignments found in this section.
        </div>
      )}
    </div>
  );
}
