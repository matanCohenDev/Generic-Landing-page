// SectionRenderer.tsx
import Header from "./LandingPageSections/Header/Header";
import Footer from "./LandingPageSections/Footer/Footer";
import Hero from "./LandingPageSections/Hero/Hero";
import Features from "./LandingPageSections/Features/Features";
import Reviews from "./LandingPageSections/Reviews/Reviews";
import AboutUs from "./LandingPageSections/AboutUs/AboutUs";
import ContactUs from "./LandingPageSections/ContactUs/ContactUs";
import Gallery from "./LandingPageSections/Gallery/Gallery";

interface Section {
  sectionName?: string;
  image?: string;
  logo?: string;
  title?: string;
  content?: string;
  buttonText?: string;
  socialMediaIcons?: string[];
  contactInfo?: string;
  location?: string;
  copyRights?: string;
  businessName?: string;
  backgroundPicture?: string;
}

interface SectionRendererProps {
  section: Section;
  onDeleteSection?: () => void;
}

const SectionRenderer = ({ section, onDeleteSection }: SectionRendererProps) => {
  if (!section || !section.sectionName) return null;
  const renderSection = () => {
    switch (section.sectionName) {
      case "header":
        return (
          <Header 
            businessName={section.businessName || ""}
            logo={section.logo || ""}
            title={section.title || ""}
            buttonText={section.buttonText || ""}
          />
        );
      case "hero":
        return (
          <Hero
            title={section.title || ""}
            content={section.content || ""}
            buttonText={section.buttonText || ""}
            backgroundPicture={"http://localhost:3000/api" + (section.backgroundPicture?.substring(61) || "")}
          />
        );
      case "features":
        return (
          <Features
            content={section.content ? section.content.split("\n") : []}
            image={"http://localhost:3000/api" + (section.image?.substring(61) || "")}
            onDelete={onDeleteSection}
          />
        );
      case "reviews":
        return (
          <Reviews
            content={section.content ? section.content.split("\n") : []}
            onDelete={onDeleteSection}
          />
        );
      case "aboutUs":
        return (
          <AboutUs
            content={section.content || ""}
            onDelete={onDeleteSection}
          />
        );
      case "contactUs":
        return <ContactUs />;
      case "gallery":
        return <Gallery />;
      case "footer":
        return (
          <Footer
            logo="/src/assets/test.png"
            contactInfo={section.contactInfo || ""}
            location={section.location || ""}
            copyRight={section.copyRights || ""}
          />
        );
      default:
        return null;
    }
  };
  return <div className={section.sectionName}>{renderSection()}</div>;
};

export default SectionRenderer;
