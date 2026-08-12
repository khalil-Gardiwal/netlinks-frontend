import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("at-language", language);
  };

  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#CBD5E1] bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
          i18n.language === "en"
            ? "bg-[#0EA5E9] text-white"
            : "text-[#64748B] hover:bg-[#F0F9FF]"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("fa")}
        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
          i18n.language === "fa"
            ? "bg-[#0EA5E9] text-white"
            : "text-[#64748B] hover:bg-[#F0F9FF]"
        }`}
      >
        دری
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("ps")}
        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
          i18n.language === "ps"
            ? "bg-[#0EA5E9] text-white"
            : "text-[#64748B] hover:bg-[#F0F9FF]"
        }`}
      >
        پښتو
      </button>
    </div>
  );
}

export default LanguageSwitcher;
