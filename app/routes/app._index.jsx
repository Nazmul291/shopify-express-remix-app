import {
  MediaCard,
  VideoThumbnail,
  Page,
  Text,
  Grid,
  Box,
  Icon,
  Button,
  FooterHelp,
  Link,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";



export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);


  return (
    <Page fullWidth>
      <div className={`wrapper ${isAnimated ? "fade-in" : ""}`}>
        <div className="main-section">
          <div className="section-header">
            <Text variant="headingLg" as="h2">
              A better way to customize your Store
            </Text>
            <Text variant="bodyMd" as="p">
              Sections Store let you buy beautifully designed,pre made sections.
              All sections are plug n-play ready to be customized in the theme
              editor.
            </Text>
          </div>
          <div className="button-container">
            <Button onClick={handleClick} variant="primary" loading={loading}>
              <div className="button-content">
                <Icon source={SearchIcon} />
                <span>Explore Section</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
