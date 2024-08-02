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
  date : Date
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
  date : Date;
  index : number;
  allItemsSelected : boolean;
}

interface RealValues {
  realLangPath: string
  realLangAttr: string
  realLangStorage: string
  realLangLocalStorage: string
  realLangMeta: string
}

interface extensionResponse {
  status: string
  domain: string
  language: string
  languageFetchedFrom: string[]
  langName: string
  langNativeName: string
  languageLocation: LanguageLocation
  languageAccuracy: string
  realValues: RealValues
  date: Date
}
export type { extensionResult, urlCardResultProps  , extensionResponse};
