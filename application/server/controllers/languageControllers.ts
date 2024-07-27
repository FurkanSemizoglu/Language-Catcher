import { Request, Response } from "express";
const Language = require("../models/language");
const User = require("../models/user");
const LanguageLocation = require("../models/languageLocation");

const addLanguageToUser = async (req: Request, res: Response) => {
  try {
    const { email, languageData } = req.body;
    console.log(email);
    console.log(languageData);
    const user = await User.findOne({ email });

    console.log(languageData);
    console.log("lang storage : ", languageData.languageLocation.localStorage);
    const languageLocation = new LanguageLocation({
      localStorage: languageData.languageLocation.localStorage,
      sessionStorage: languageData.languageLocation.sessionStorage,
      metaTag: languageData.languageLocation.metaTag,
      htmlTag: languageData.languageLocation.htmlTag,
      url: languageData.languageLocation.url,
      paragraph: languageData.languageLocation.paragraph,
    });
    await languageLocation.save();

    const language = new Language({
      domain: languageData.domain,
      language: languageData.language,
      languageFetchedFrom: languageData.languageFetchedFrom,
      langName: languageData.langName,
      langNativeName: languageData.langNativeName,
      languageLocation: languageLocation._id, // Storing the reference to LanguageLocation
      languageAccuracy: languageData.languageAccuracy,
    });
    await language.save();

    user.languageUrls.push(language);

    await user.save();

    res.status(200).json({
      status: "OK",
      user,
      language,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getUserLanguages = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    /*   const user = await User.findOne ({ email }).populate("languageUrls");  */
    const user = await User.findOne({ email }).populate({
      path: "languageUrls",
      populate: {
        path: "languageLocation",
        model: "LanguageLocation",
      },
    });
    /*   console.log(Language.languageLocation._id);
        user.languageUrls.forEach((language :any) => {
            language.languageLocation = LanguageLocation.findById(language.languageLocation);
        }); */
    res.status(200).json(user.languageUrls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addLanguageToUser, getUserLanguages };
