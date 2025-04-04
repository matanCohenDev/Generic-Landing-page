// Form.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import MobileView from "../components/SideBar/MobileView/MobileView"; 
import DesktopView from "./SideBar/DesktopView/DesktopView";
import TabletView from "./SideBar/TabletView/TabletView";
import { Input } from "./ui/input";
import SectionRenderer from "./sectionRendering";
import Sidebar from "./SideBar/sideBar";
import styles from "./landingPageStyles.module.css";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface RemovedSection {
  section: any;
  index: number;
}

function Form() {
  const [formData, setFormData] = useState({
    businessName: "Cafe Delight",
    businessField: "בתי קפה",
    businessFieldDetails: "בתי קפה עם אווירה ייחודית ועיצוב מודרני",
    businessType: "עסק עצמאי",
    serviceAreas: "תל אביב, ירושלים",
    serviceDescription: "אנו מציעים קפה איכותי, מאפים טריים ואווירה מזמינה למפגשים חברתיים",
    socialMediaAccounts: "instagram.com/cafedelight",
    contactInfo: "contact@cafedelight.com",
    location: "ישראל",
    callToAction: "בואו להתפנק עם הקפה הטוב ביותר!",
    ageGroup: "כל הגילאים",
    targetAudience: "חובבי קפה ואנשים שמחפשים מקום מפגש איכותי",
    yearOfExperience: "10",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [landingPageData, setLandingPageData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [colors, setColors] = useState({
    primaryColor: "#ffffff",
    secondaryColor: "#ffffff",
    tertiaryColor: "#ffffff",
    textColor: "#000000",
  });
  const [userFont, setUserFont] = useState("sans-serif");
  const [removedSections, setRemovedSections] = useState<RemovedSection[]>([]);
  const [responsiveView, setResponsiveView] = useState<"desktop" | "tablet" | "mobile" | "">("");
  const landingPageRef = useRef<HTMLDivElement>(null);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showTabletPopup, setShowTabletPopup] = useState(false);
  const [showDesktopPopup, setShowDesktopPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response: Response = await fetch("http://localhost:3000/api/generateLandingPageContext", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("שגיאה ביצירת דף הנחיתה");
      const data = await response.json();
      if (data) {
        const sectionsArray = Object.keys(data).map((key) => data[key]);
        setLandingPageData(sectionsArray);
        setSubmitted(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "שגיאה בלתי צפויה");
      } else {
        setError("שגיאה בלתי צפויה");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (landingPageData) {
      console.log("Landing Page Data:", landingPageData);
    }
  }, [landingPageData]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newSections = Array.from(landingPageData);
    const [removed] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, removed);
    setLandingPageData(newSections);
  };

  const handleColorChange = (
    primaryColor: string,
    secondaryColor: string,
    tertiaryColor: string,
    textColor: string
  ) => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    document.documentElement.style.setProperty("--tertiary-color", tertiaryColor);
    document.documentElement.style.setProperty("--text-color", textColor);
    setColors({ primaryColor, secondaryColor, tertiaryColor, textColor });
  };

  const handleFontChange = (font: string) => {
    document.documentElement.style.setProperty("--font", font);
    setUserFont(font);
  };

  const handleSaveLandingPage = async () => {
    setIsSidebarOpen(false);
    setTimeout(async () => {
      if (!landingPageRef.current) return;
      const clone = landingPageRef.current.cloneNode(true) as HTMLElement;
      const resizeHandles = clone.querySelectorAll("[data-resize-handle]");
      resizeHandles.forEach((el) => el.remove());
      const landingPageHTML = clone.innerHTML;
      const completeHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Landing Page</title>
            <link rel="stylesheet" href="http://localhost:3000/dist/assets/index-uoALyoE3.css">
            <style>
              :root {
                --primary-color: ${colors.primaryColor};
                --secondary-color: ${colors.secondaryColor};
                --tertiary-color: ${colors.tertiaryColor};
                --text-color: ${colors.textColor};
                --font: ${userFont};
              }
            </style>
          </head>
          <body>
            ${landingPageHTML}
          </body>
        </html>
      `;
      try {
        const response = await fetch("http://localhost:3000/api/saveLandingPage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: completeHTML,
            userPrimaryColor: colors.primaryColor,
            userSecondaryColor: colors.secondaryColor,
            userTertiaryColor: colors.tertiaryColor,
            userTextColor: colors.textColor,
            userFont: userFont,
          }),
        });
        if (response.ok) {
          alert("Landing page saved successfully!");
        } else {
          alert("Error saving landing page");
        }
      } catch (error) {
        console.error("Error saving landing page:", error);
        alert("Error saving landing page");
      }
    }, 500);
  };

  const handleDelete = (index: number, section: any) => {
    setRemovedSections((prev) => [...prev, { section, index }]);
    setLandingPageData((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const handleRestore = (item: RemovedSection) => {
    setLandingPageData((prev: any[]) => {
      const newSections = [...prev];
      newSections.splice(item.index, 0, item.section);
      return newSections;
    });
    setRemovedSections((prev) => prev.filter((rs) => rs !== item));
  };

  const handleResponsiveChange = (view: "desktop" | "tablet" | "mobile" | "") => {
    setResponsiveView(view);
  };

  return (
    <div className=" ">
      {loading && <p className="text-blue-500">🔄 טוען... נא להמתין</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
      {submitted && landingPageData ? (
        <div className={styles.landingPageLayout}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  className={`${styles.sectionsContainer} ${isSidebarOpen ? styles.withSidebar : ""} ${responsiveView ? styles[responsiveView] : ""}`}
                  ref={(node) => {
                    landingPageRef.current = node;
                    provided.innerRef(node);
                  }}
                  {...provided.droppableProps}
                >
                  {landingPageData.map((section: any, index: number) => (
                    <Draggable
                      key={section.sectionName + index}
                      draggableId={section.sectionName + index}
                      index={index}
                      isDragDisabled={["header", "hero", "footer"].includes(section.sectionName || "")}
                    >
                      {(providedDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                        >
                          <SectionRenderer section={section} onDeleteSection={() => handleDelete(index, section)} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            onOk={handleSaveLandingPage}
            onColorChange={handleColorChange}
            onFontChange={handleFontChange}
            removedSections={removedSections}
            onRestore={handleRestore}
            onResponsiveChange={handleResponsiveChange}
            setShowMobilePopup={setShowMobilePopup}
            setShowTabletPopup={setShowTabletPopup}
            setShowDesktopPopup={setShowDesktopPopup}
            
          />
          {responsiveView === "mobile" && showMobilePopup &&  (
            <MobileView onClose={() => setShowMobilePopup(false)}>
              <div className={styles.sectionsContainer}>
                {landingPageData.map((section: any, index: number) => (
                  <SectionRenderer key={index} section={section} />
                ))}
              </div>
            </MobileView>
          )}
          {responsiveView === "tablet" && showTabletPopup && (
            <TabletView onClose={() => setShowTabletPopup(false)}>
              <div className={styles.sectionsContainer}>
                {landingPageData.map((section: any, index: number) => (
                  <SectionRenderer key={index} section={section} />
                ))}
              </div>
            </TabletView>
          )}
          {responsiveView === "desktop" && showDesktopPopup && (
            <DesktopView onClose={() => setShowDesktopPopup(false)}>
              <div className={styles.sectionsContainer}>
                {landingPageData.map((section: any, index: number) => (
                  <SectionRenderer key={index} section={section} />
                ))}
              </div>
            </DesktopView>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">🚀 צור דף נחיתה</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="businessName" placeholder="שם העסק" value={formData.businessName} onChange={handleChange} />
            <Input name="businessField" placeholder="תחום עיסוק" value={formData.businessField} onChange={handleChange} />
            <Input name="businessFieldDetails" placeholder="תיאור תחום העיסוק" value={formData.businessFieldDetails} onChange={handleChange} />
            <Input name="businessType" placeholder="סוג העסק" value={formData.businessType} onChange={handleChange} />
            <Input name="serviceAreas" placeholder="אזורי שירות" value={formData.serviceAreas} onChange={handleChange} />
            <Input name="serviceDescription" placeholder="תיאור השירות" value={formData.serviceDescription} onChange={handleChange} />
            <Input name="socialMediaAccounts" placeholder="חשבונות רשתות חברתיות" value={formData.socialMediaAccounts} onChange={handleChange} />
            <Input name="contactInfo" placeholder="פרטי יצירת קשר" value={formData.contactInfo} onChange={handleChange} />
            <Input name="location" placeholder="מיקום" value={formData.location} onChange={handleChange} />
            <Input name="callToAction" placeholder="קריאה לפעולה" value={formData.callToAction} onChange={handleChange} />
            <Input name="ageGroup" placeholder="קבוצת גיל" value={formData.ageGroup} onChange={handleChange} />
            <Input name="targetAudience" placeholder="קהל יעד" value={formData.targetAudience} onChange={handleChange} />
            <Input name="yearOfExperience" placeholder="שנות ניסיון" value={formData.yearOfExperience} onChange={handleChange} />
            <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
              🚀 צור דף נחיתה
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Form;
