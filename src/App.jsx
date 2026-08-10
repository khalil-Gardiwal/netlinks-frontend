import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          Netlinks Frontend
        </h1>

        <p className="mt-4 text-red-600">
          {t("errors.required")}
        </p>
      </div>
    </div>
  );
}

export default App;