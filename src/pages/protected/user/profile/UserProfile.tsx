import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getMe } from "../../../../api/auth";
import AttachmentModal from "../../../../components/attachment/AttachmentModal";

type UserProfileData = {
  fullname?: string;
  phone?: string;
};

function UserProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMe();

        console.log("USER PROFILE DATA:", response.data);

        setUser(response.data);
      } catch (err) {
        console.error("GET USER PROFILE FAILED:", err);

        setError(
          t(
            "profile.loadError",
            "Unable to load your profile."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [t]);

  const handleAttachmentComplete = (file: File) => {
    console.log("Profile image:", file);

    const previewUrl = URL.createObjectURL(file);

    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }

    setProfileImage(previewUrl);
    setShowAttachmentModal(false);
  };

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />

              <div className="space-y-3">
                <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17h.01"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 active:bg-sky-700"
            >
              {t("common.retry", "Retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("profile.title", "My Profile")}
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {t(
                "profile.subtitle",
                "Manage your personal information."
              )}
            </p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Profile Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-5 py-8 sm:px-8">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-sky-100 shadow-md">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={t(
                          "profile.profilePicture",
                          "Profile picture"
                        )}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-sky-600">
                        {user?.fullname
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={() => setShowAttachmentModal(true)}
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-sky-500 text-white shadow-md transition hover:bg-sky-600 active:bg-sky-700"
                    aria-label={t(
                      "profile.changePicture",
                      "Change profile picture"
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
                      />
                      <circle
                        cx="12"
                        cy="13"
                        r="3.5"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-slate-900">
                    {user?.fullname || "-"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {user?.phone || "-"}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAttachmentModal(true)}
                    className="mt-3 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                  >
                    {t(
                      "profile.changePicture",
                      "Change profile picture"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="px-5 py-6 sm:px-8">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t(
                    "profile.personalInformation",
                    "Personal Information"
                  )}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t(
                    "profile.personalInformationDescription",
                    "Your basic account information."
                  )}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t("profile.fullName", "Full name")}
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {user?.fullname || "-"}
                  </p>
                </div>

                {/* Phone */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t("profile.phone", "Phone")}
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {user?.phone || "-"}
                  </p>
                </div>
              </div>

              {/* Future Edit Section */}
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {t(
                        "profile.completeProfile",
                        "Complete your profile"
                      )}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {t(
                        "profile.completeProfileDescription",
                        "Additional profile information can be added here."
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/user/profile/edit")}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {t("profile.editProfile", "Edit profile")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Modal */}
      <AttachmentModal
        open={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onComplete={handleAttachmentComplete}
      />
    </>
  );
}

export default UserProfile;
