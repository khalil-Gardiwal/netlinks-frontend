import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../../../api/auth";
import AttachmentModal from "../../../../components/attachment/AttachmentModal";

type ProfileErrors = {
  general?: string;
  fullname?: string;
  phone?: string;
};

function EditUserProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showAttachmentModal, setShowAttachmentModal] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [errors, setErrors] = useState<ProfileErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const response = await getMe();

        setFullname(response.data?.fullname || "");
        setPhone(response.data?.phone || "");
      } catch (error: unknown) {
        console.error("FAILED TO LOAD USER:", error);

        setErrors({
          general: t(
            "profile.loadError",
            "Unable to load your profile."
          ),
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [t]);

  const validateForm = (): boolean => {
    const newErrors: ProfileErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = t(
        "profile.fullNameRequired",
        "Full name is required."
      );
    }

    if (!phone.trim()) {
      newErrors.phone = t(
        "profile.phoneRequired",
        "Phone number is required."
      );
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      /*
       * BACKEND INTEGRATION WILL BE ADDED HERE.
       *
       * For now we only show the data that will eventually
       * be sent to the backend.
       */

      console.log("PROFILE UPDATE:", {
        fullname: fullname.trim(),
        phone: phone.trim(),
        profileImage,
      });

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 700);
      });

      setSuccessMessage(
        t(
          "profile.frontendSaved",
          "Your changes are ready to be saved."
        )
      );
    } catch (error: unknown) {
      console.error("PROFILE UPDATE FAILED:", error);

      setErrors({
        general: t(
          "profile.updateError",
          "Something went wrong while updating your profile."
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAttachmentComplete = (file: File): void => {
    console.log("NEW PROFILE IMAGE:", file);

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
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 18l-6-6 6-6"
                />
              </svg>

              {t("common.back", "Back")}
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("profile.editTitle", "Edit Profile")}
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {t(
                "profile.editSubtitle",
                "Update your personal information."
              )}
            </p>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Profile Image */}
              <div className="border-b border-slate-200 px-5 py-7 sm:px-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-sky-100 shadow-md ring-1 ring-slate-200">
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
                          {fullname?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAttachmentModal(true)
                      }
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

                        <circle cx="12" cy="13" r="3.5" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAttachmentModal(true)
                    }
                    className="mt-4 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                  >
                    {t(
                      "profile.changePicture",
                      "Change profile picture"
                    )}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 px-5 py-7 sm:px-8">
                {/* General Error */}
                {errors.general && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors.general}
                  </div>
                )}

                {/* Success */}
                {successMessage && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {t("profile.fullName", "Full name")}
                  </label>

                  <input
                    id="fullname"
                    type="text"
                    value={fullname}
                    onChange={(event) => {
                      setFullname(event.target.value);

                      if (errors.fullname) {
                        setErrors((previous) => ({
                          ...previous,
                          fullname: "",
                        }));
                      }
                    }}
                    placeholder={t(
                      "profile.fullNamePlaceholder",
                      "Enter your full name"
                    )}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.fullname
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                    }`}
                  />

                  {errors.fullname && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {t("profile.phone", "Phone")}
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);

                      if (errors.phone) {
                        setErrors((previous) => ({
                          ...previous,
                          phone: "",
                        }));
                      }
                    }}
                    placeholder={t(
                      "profile.phonePlaceholder",
                      "+937XXXXXXXX"
                    )}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.phone
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                    }`}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    {t(
                      "profile.phoneChangeNote",
                      "Changing your phone number may require verification."
                    )}
                  </p>

                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={() => navigate("/user/profile")}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("common.cancel", "Cancel")}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 active:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? t("profile.saving", "Saving...")
                    : t(
                        "profile.saveChanges",
                        "Save Changes"
                      )}
                </button>
              </div>
            </form>
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

export default EditUserProfile;
