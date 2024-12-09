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
import cardData from "../json/indexSteps.json";
import indexStyle from "../components/index.css?url";

export const links = () => [
  { rel: "stylesheet", href: indexStyle },
];

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleClick = () => {
    setLoading(true);
    navigate("/app/explore");
  };

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
          <Grid>
            {cardData.map((item, index) => (
              <Grid.Cell
                key={index}
                columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}
                style={{ padding: "10px" }}
              >
                <div className="card-content">
                  <div className="image-container">
                    <img
                      src={item.image}
                      alt={`Card Image ${index}`}
                      className="card-image"
                    />
                  </div>
                  <Text variant="headingMd" as="h3" className="card-title">
                    {item.title}
                  </Text>
                  <Text variant="bodySm" as="p" className="card-description">
                    {item.desc}
                  </Text>
                </div>
              </Grid.Cell>
            ))}
          </Grid>
          <div className="button-container">
            <Button onClick={handleClick} variant="primary" loading={loading}>
              <div className="button-content">
                <Icon source={SearchIcon} />
                <span>Explore Section</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="media-section">
          <MediaCard
            title="Turn your side-project into a business"
            primaryAction={{
              content: "Watch tutorial",
              onAction: () => {},
            }}
            description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
            popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
            size="small"
          >
            <VideoThumbnail
              videoLength={80}
              thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
              onClick={() => console.log("clicked")}
            />
          </MediaCard>

          <FooterHelp>
            Learn more about{" "}
            <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
              Section Store
            </Link>
          </FooterHelp>
        </div>
      </div>
    </Page>
  );
}
