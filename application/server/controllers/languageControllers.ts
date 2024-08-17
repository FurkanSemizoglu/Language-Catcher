import { Request, Response } from "express";
import path from "path";
const Language = require("../models/language");
const User = require("../models/user");
const LanguageLocation = require("../models/languageLocation");
const RealLangValues = require("../models/realLangValues");

const addLanguageToUser = async (req: Request, res: Response) => {
  try {
    const { email, languageData } = req.body;
    console.log(email);

    const user = await User.findOne({ email });

    const languageLocation = new LanguageLocation({
      localStorage: languageData.languageLocation.localStorage,
      sessionStorage: languageData.languageLocation.sessionStorage,
      metaTag: languageData.languageLocation.metaTag,
      htmlTag: languageData.languageLocation.htmlTag,
      url: languageData.languageLocation.url,
      paragraph: languageData.languageLocation.paragraph,
    });
    await languageLocation.save();
    console.log("lang path : ", languageData.realValues.realLangPath);
    const realLangValue = new RealLangValues({
      realLangPath: languageData.realValues.realLangPath,
      realLangAttr: languageData.realValues.realLangAttr,
      realLangStorage: languageData.realValues.realLangStorage,
      realLangLocalStorage: languageData.realValues.realLangLocalStorage,
      realLangMeta: languageData.realValues.realLangMeta,
    });

    await realLangValue.save();

    const language = new Language({
      domain: languageData.domain,
      language: languageData.language,
      languageFetchedFrom: languageData.languageFetchedFrom,
      langName: languageData.langName,
      langNativeName: languageData.langNativeName,
      languageLocation: languageLocation._id,
      languageAccuracy: languageData.languageAccuracy,
      realLangValues: realLangValue._id,
      date: languageData.date,
      belongUser: user._id
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
      populate: [
        {
          path: "languageLocation",
          model: "LanguageLocation",
        },
        {
          path: "realLangValues",
          model: "RealLangValues",
        },
        {
          path: "belongUser",
          model: "User",
          select: "email"
        }
      ],
    });
    console.log(user.languageUrls);
    res.status(200).json(user.languageUrls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLanguage = async (req: Request, res: Response) => {
  try {
    const { email, languageId } = req.query;
    const user = await User.findOne({ email });
    const language = await Language.findById(languageId)
      .populate("languageLocation")
      .populate("realLangValues");

    await LanguageLocation.findByIdAndDelete(language.languageLocation._id);
    await RealLangValues.findByIdAndDelete(language.realLangValues._id);
    await Language.findByIdAndDelete(languageId);
    user.languageUrls = user.languageUrls.filter(
      (lang: any) => lang._id != languageId
    );
    await user.save();
    res.status(200).json(user.languageUrls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const deletesLanguages = async (req: Request, res: Response) => {
  try {
    const { email, languageIdList } = req.query;

    if (!email || !languageIdList) {
      return res.status(400).json({ error: "Missing email or languageIdList" });
    }

    const user = await User.findOne({ email }).populate({
      path: "languageUrls",
      populate: [
        {
          path: "languageLocation",
          model: "LanguageLocation",
        },
        {
          path: "realLangValues",
          model: "RealLangValues",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(languageIdList)) {
      return res
        .status(400)
        .json({ error: "languageIdList should be an array" });
    }

    for (const element of languageIdList) {
      const language = await Language.findById(element)
        .populate("languageLocation")
        .populate("realLangValues");

      if (language && language.languageLocation && language.realLangValues) {
        await LanguageLocation.findByIdAndDelete(language.languageLocation._id);
        await RealLangValues.findByIdAndDelete(language.realLangValues._id);
        await Language.findByIdAndDelete(element);
      }
    }

    user.languageUrls = user.languageUrls.filter(
      (lang: any) => !languageIdList.includes(lang._id.toString())
    );

    await user.save();
    res.status(200).json(user.languageUrls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Language.find({})
      .populate("languageLocation")
      .populate("realLangValues")
      .populate("belongUser", "email");
    res.status(200).json(languages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const addLanguagesToGivenUser = async (req: Request, res: Response) => {
  try {
    const { email, languages } = req.body;
    const user = await User.findOne({ email }).populate({
      path: "languageUrls",
      populate: [
        {
          path: "languageLocation",
          model: "LanguageLocation",
        },
        {
          path: "realLangValues",
          model: "RealLangValues",
        },
      ],
    });

    if (!user) {
      const newUser = await User.create({
        email,
        password: "123456",
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addLanguageToUser,
  getUserLanguages,
  deleteLanguage,
  deletesLanguages,
  getAllLanguages,
};
