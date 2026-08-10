
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    lng: "fa",
    fallbackLng: "fa",

    resources: {
      fa: {
        translation: {
          errors: {
            required: "This field is required",
            invalidPhone: "Invalid phone number",
          },
        },
      },

      ps: {
        translation: {
          errors: {
            required: "This field is required",
            invalidPhone: "Invalid phone number",
          },
        },
      },
    },
  });

export default i18n;

