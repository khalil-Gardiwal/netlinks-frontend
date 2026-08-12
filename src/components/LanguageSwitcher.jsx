import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      className="rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
    >
      <option value="en">English</option>
      <option value="fa">دری</option>
      <option value="ps">پښتو</option>
    </select>
  );
}

export default LanguageSwitcher;
