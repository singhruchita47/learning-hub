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
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {filteredAssignments.length > 0 ? (
        filteredAssignments.map((assignment) => {
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
              className="rounded-xl bg-white p-3 shadow-sm border border-slate-200 flex flex-col justify-between gap-2 transition hover:shadow-md aspect-square max-h-[220px]"
            >
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`rounded border px-1.5 py-0.5 text-[8px] font-black uppercase ${statusColor}`}>
                    {statusText}
                  </span>
                  <span className="text-[8px] font-black uppercase text-slate-400">
                    {formatDate(assignment.dueDate)}
                  </span>
                </div>

                <h3 className="text-xs font-black text-slate-800 line-clamp-1">{assignment.title}</h3>
                <p className="mt-0.5 text-[9px] font-semibold text-slate-500 line-clamp-2 leading-tight">
                  {assignment.description}
                </p>

                {assignment.imageUrl && (
                  <div className="mt-1.5 rounded bg-slate-50 flex-1 min-h-0 overflow-hidden flex items-center justify-center border border-slate-100">
                    <img src={assignment.imageUrl} alt="Ref" className="max-h-full max-w-full object-cover" />
                  </div>
                )}
                
                {!assignment.imageUrl && <div className="flex-1" />}

                <div className="mt-2 border-t border-slate-100 pt-2 shrink-0">
                  {assignment.submittedFileName ? (
                    <div className="rounded bg-emerald-50 p-1.5 flex flex-col items-center justify-center text-center">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 mb-0.5" />
                      <span className="text-[8px] font-black text-emerald-700 truncate w-full">Uploaded</span>
                    </div>
                  ) : (
                    <label className="flex h-6 w-full cursor-pointer items-center justify-center gap-1 rounded bg-violet-600 text-[9px] font-black text-white hover:bg-violet-700 transition">
                      {uploadingId === assignment.id ? <Loader className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                      {uploadingId === assignment.id ? "..." : "Upload"}
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
                  )}
                  {uploadError[assignment.id] && (
                    <p className="text-[8px] text-center font-bold text-red-600 mt-0.5">{uploadError[assignment.id]}</p>
                  )}
                </div>
              </div>
            </article>
          );
        })
      ) : (
        <div className="col-span-full py-8 text-center text-slate-400 font-bold text-xs border border-dashed border-slate-200 rounded-xl bg-white">
          No assignments found.
        </div>
      )}
    </div>
  );
}
