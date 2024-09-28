// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import  LanguageDetector  from "i18next-browser-languagedetector";
// import translateEN from "./translation/en.json";
// import translateAR from "./translation/ar.json";

// const resources = {
//   en: {
//     translation:{
//       "All Authors":"All Authors",
//         "Author Image":"Author Image",
//         "Author Name":"Author Name",
//         "Author Bio":"Author Bio",
//         "Actions":"Actions",
//         "Book Details":"Book Details",
//         "Details for book ID:":"Details for book ID:",
//         "Book Title":"Book Title",
//         "Author name:":"Author name :"
//     }
//   },
//   ar: {
//     translation: { "All Authors":"كل المؤلفين",
//       "Author Image":"صورة المؤلف",
//       "Author Name":"اسم المؤلف",
//       "Author Bio":"السيرة الذاتية للمؤلف",
//       "Actions":"الإجراءات",
//       "Book Details":"تفاصيل الكتاب",
//       "Details for book ID:":"تفاصيل معرف الكتاب:",
//       "Book Title":"عنوان الكتاب",
//       "Author name:":"اسم المؤلف :"}
//   },
// };

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en",

//     interpolation: {
//       escapeValue: false,
//     },
//     react: {
//       useSuspense: false,
//     },
//   });

// export default i18n;


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translateEN from './translation/en.json';
import translateAR from './translation/ar.json';

const resources = {
  en: { translation: translateEN },
  ar: { translation: translateAR },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // يمكنك تغيير اللغة هنا
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
  export default i18n;