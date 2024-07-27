interface LanguageLocation {
  localStorage: boolean;
  sessionStorage: boolean;
  metaTag: boolean;
  htmlTag: boolean;
  url: boolean;
  paragraph: boolean;
}

interface extensionResult {
  status: string;
  domain: string;
  language: string;
  languageFetchedFrom: string[];
  langName: string;
  langNativeName: string;
  languageLocation: LanguageLocation;
  languageAccuracy: string;
}


interface urlCardResultProps {
    url: string;
    detectedLanguage: string;
    detectedPlaces: string[];
    languageLocation: LanguageLocation;
    langName: string;
    langNativeName: string;
    accuracy : string;
}

export type { extensionResult ,urlCardResultProps};
