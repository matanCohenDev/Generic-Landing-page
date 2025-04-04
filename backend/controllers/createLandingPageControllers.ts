import { Request, Response } from 'express';
import { generateContent, fetchPexelsImage } from '../services/geminiFunctions';
import { inputType } from '../types';
import path from 'path';

export const generateLandingPageContext = async (req: Request, res: Response): Promise<void>  => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        
        const businessFieldTranslate = await generateContent(
            `Please translate the following business field into a single, precise English keyword that best represents its core concept for image search. 
            For example, if the field is "בתי קפה", return "coffee"; if it is "עוגות ומתוקים", return "confectionery" or a similarly appropriate term.
            Business field: ${req.body.businessField}`
        );
        
        const inputDetails: inputType = req.body;

        const nameOfMainPicture = `${Date.now() + businessFieldTranslate.replace(/\s+/g, "_")}.jpg`;
        const imageFeatureGeneratePath = path.join(__dirname, '../pexels_images', nameOfMainPicture);

        // const nameOfBackgroundPicture = `${Date.now() + businessFieldTranslate.replace(/\s+/g, "_")}_background.jpg`;
        // const imageBackgroundGeneratePath = path.join(__dirname, '../pexels_images', nameOfBackgroundPicture);

        const headerSection = {
            sectionName: "header",
            businessName: inputDetails.businessName,
            buttonText: await generateContent(`כתוב קריאה לפעולה מובילה וממוקדת לפעולה, כגון: "הזמן עכשיו", "צור קשר", "קבל הצעת מחיר מיידית", "קבל יעוץ חינם"
            המשתמש הכניס את הקריאה לפעולה הזאת : ${inputDetails.callToAction}
            שלא יעלה על 3 מילים`)
        };

        const heroSection = {
            sectionName: "hero",
            title: await generateContent(`צור כותרת ברורה, חדשנית ומתאימה לדף נחיתה של עסק בשם ${inputDetails.businessName} בתחום ${inputDetails.businessField}
            על הכותרת להיות ממוקדת, מזמינה ואטרקטיבית, באורך משפט אחד ולהעביר את המסר המרכזי של העסק. 
            יש להימנע מסימני פיסוק מיותרים בסוף המשפט.`),
            content: await generateContent(`כתוב פסקת תיאור עסקית שמתארת בצורה ממוקדת את הפעילות העיקרית של העסק, בשפה ברורה ותקנית.
            אורך הפסקה לא יעלה על 3 שורות. 
            פרטים שהמשתמש הכניס בטופס:
            תחום עיסוק: ${inputDetails.businessField}
            תיאור תחום העיסוק: ${inputDetails.businessFieldDetails}
            שם העסק: ${inputDetails.businessName}
            סוג העסק: ${inputDetails.businessType}
            אזורי שירות: ${inputDetails.serviceAreas}
            תיאור השירות: ${inputDetails.serviceDescription}
            קהל יעד: ${inputDetails.targetAudience}
            יש להימנע מסימני פיסוק מיותרים בסוף המשפט.`),
            buttonText: headerSection.buttonText,
            //backgroundPicture: await fetchPexelsImage(businessFieldTranslate + " background", imageBackgroundGeneratePath)
        };

        const featuresSection = {
            sectionName: "features",
            content: await generateContent(`
              צור מערך JSON של רשימת השירותים שהעסק "${inputDetails.businessName}" מספק.
              כל שירות יוצג כערך נפרד במערך, ויכלול אימוג'י ✔️ בתחילתו.
              כתוב את כל הטקסט בצורה המותאמת לכתיבה מימין לשמאל (RTL).
              אל תשתמש במה שהמשתמש רשם, אלא כתוב משפט מפורט על כל אחד מהשירותים בעל 5-6 מילים, 
              משפט מפוצץ שמסביר את השירות, ללא פסיקים או סימני פיסוק מיותרים.
              📌 **מבנה הפלט הרצוי (JSON תקין):**
              [
                "✔️שירות ראשון",
                "✔️שירות שני",
                "✔️שירות שלישית",
                "✔️שירות רביעי"
              ]
              השירותים שהמשתמש הכניס בטופס: ${inputDetails.serviceDescription}
              וודא שהערכים אינם כוללים סימני פיסוק או מילים לא קשורות, והפלט יהיה בפורמט JSON תקין.
            `),
            image: await fetchPexelsImage(businessFieldTranslate , imageFeatureGeneratePath)
        };

        const reviewsSection = {
            sectionName: "reviews",
            content: await generateContent(`
                צור מערך של 4 חוות דעת חיוביות על העסק "${inputDetails.businessName}".
                כל חוות דעת תהיה באורך של שני משפטים, בשפה תקינה ומקצועית.
                החזר בפורמט JSON תקין, כך שהמבנה יהיה:
                [
                    "חוות דעת ראשונה...",
                    "חוות דעת שנייה...",
                    "חוות דעת שלישית...",
                    "חוות דעת רביעית..."
                ]
                יש להשתמש במילים בהווה, כגון: "מקסים", "מקצועי", "אדיב", "אמין", "מסודר".
                יש להימנע מפרטים אישיים ולהסיר נקודות וסימני פיסוק מיותרים.
            `)
        };

        const aboutUsSection = {
            sectionName: "aboutUs",
            content: await generateContent(`כתוב פסקת תיאור על העסק ${inputDetails.businessName} באורך של 5 שורות.
            הפסקה צריכה להיות ממוקדת ולהעביר את המסר המרכזי של העסק.
            פרטים שהמשתמש הכניס בטופס:
            שנות ניסיון: ${inputDetails.yearOfExperience}
            קבוצת גיל: ${inputDetails.ageGroup}
            יש להימנע מסימני פיסוק בסוף המשפט.`)
        };

        const gallerySection = {
            sectionName: "gallery",
        };

        const contactUsSection = {
            sectionName: "contactUs",
        };

        const footerSection = {
            sectionName: "footer",
            socialMediaIcons: inputDetails.socialMediaAccounts,
            contactInfo: inputDetails.contactInfo,
            location: inputDetails.location,
            copyRights: "©2025 כל הזכויות שמורות לצוות Smarketing "
        };

        const context = {
            headerSection,
            heroSection,
            featuresSection,
            reviewsSection,
            aboutUsSection,
            gallerySection,
            contactUsSection,
            footerSection,
        };

        res.status(200).json(context);
    } catch (error) {
        console.error("Error generating context:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getTextSuggestions = async (req: Request, res: Response): Promise<void> => {
    const { text, tone } = req.body;
    try {
        const prompt = `Please provide an improved version of the following text in Hebrew. The revised text should be more concise, precise, and reflect the following tone instructions: "${tone}". Original text: ${text}`;
        const suggestion = await generateContent(prompt);
        res.status(200).json({ suggestion });
    } catch (error) {
        console.error("Error generating text suggestions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
