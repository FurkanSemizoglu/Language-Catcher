interface LanguageLocation {
  localStorage: boolean;
  sessionStorage: boolean;
  metaTag: boolean;
  htmlTag: boolean;
  url: boolean;
  paragraph: boolean;
}

interface realLangValues {
  realLangPath: string;
  realLangAttr: string;
  realLangStorage: string;
  realLangLocalStorage: string;
  realLangMeta: string;
}

interface extensionResult {
  _id: string;
  status: string;
  domain: string;
  language: string;
  languageFetchedFrom: string[];
  langName: string;
  langNativeName: string;
  languageLocation: LanguageLocation;
  languageAccuracy: string;
  realLangValues: realLangValues;
}



interface urlCardResultProps {
  email: string;
  url: string;
  detectedLanguage: string;
  detectedPlaces: string[];
  languageLocation: LanguageLocation;
  langName: string;
  langNativeName: string;
  accuracy: string;
  id : string;
  realLangValues: realLangValues;
}

export type { extensionResult, urlCardResultProps };
