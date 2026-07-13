import { useEffect, useState } from "react";
import { CalendarDays, FileText, MessageSquareText, Upload, Loader, Image } from "lucide-react";
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

export default function StudentAssignmentsPanel() {
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

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-in fade-in duration-500">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Assignments</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Upload submissions and view faculty feedback.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600">
          {assignments.length} assigned
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <article key={assignment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-650">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-indigo-50 px-2 py-0.5 rounded text-indigo-600">
                    {assignment.courseCode || "CSE"}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-2">{assignment.title}</h3>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                  {assignment.description}
                </p>

                {/* Render attached reference image */}
                {assignment.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 max-h-[160px] bg-white shadow-sm p-1">
                    <img
                      src={assignment.imageUrl}
                      alt="Reference attachment"
                      className="w-full h-full object-contain rounded-lg max-h-[145px]"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500 border-t border-slate-200/50 pt-2">
                  <CalendarDays className="h-4 w-4 text-indigo-550" />
                  Due {formatDate(assignment.dueDate)}
                </div>

                {assignment.submittedFileName && (
                  <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                    {assignment.submittedFileUrl ? (
                      <a
                        href={assignment.submittedFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-emerald-600 hover:text-emerald-800"
                      >
                        Uploaded: {assignment.submittedFileName}
                      </a>
                    ) : (
                      <span>Uploaded: {assignment.submittedFileName}</span>
                    )}
                    {assignment.studentNote && (
                      <p className="mt-1 text-emerald-800">Your note: {assignment.studentNote}</p>
                    )}
                  </div>
                )}

                {assignment.feedback && (
                  <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3 space-y-2">
                    <p className="mb-1 flex items-center gap-2 text-xs font-extrabold text-amber-700">
                      <MessageSquareText className="h-4 w-4" />
                      Faculty Feedback & Grade
                    </p>
                    {assignment.marks !== undefined && (
                      <p className="text-xs font-black text-slate-900 bg-white/65 rounded px-2.5 py-1 w-fit">
                        Score: <span className="text-[#7b35ad]">{assignment.marks}</span> marks
                      </p>
                    )}
                    <p className="text-sm font-medium leading-6 text-slate-750">{assignment.feedback}</p>
                  </div>
                )}

                <textarea
                  value={notes[assignment.id] ?? ""}
                  onChange={(event) => setNotes((current) => ({ ...current, [assignment.id]: event.target.value }))}
                  placeholder="Add a note for faculty..."
                  rows={2}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-300"
                />

                <label className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-650 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700 transition-all">
                  {uploadingId === assignment.id ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploadingId === assignment.id ? "Uploading..." : assignment.submittedFileName ? "Replace File" : "Upload Submission"}
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
                {uploadError[assignment.id] && (
                  <p className="mt-2 text-xs font-bold text-red-600">{uploadError[assignment.id]}</p>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">
            No assignments assigned yet.
          </div>
        )}
      </div>
    </section>
  );
}
