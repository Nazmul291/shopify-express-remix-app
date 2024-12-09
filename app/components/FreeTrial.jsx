import { CalloutCard } from "@shopify/polaris";
import React from "react";

export default function FreeTrial() {
  return (
    <div style={{ maxHeight: "20%" }}>
      <CalloutCard
        title="Try out all Design Packs for Free"
        illustration="/assets/navigationIconsImages/free-trial.svg"
        primaryAction={{
          content: "Start 14-day Trial",
          url: "#",
          tone: "success",
          variant: "primary",
        }}
      >
        <p>
          Design your dream website hassle-free with our theme sections in the
          shopify theme editor. Start your risk-free 14-day trial today and
          experience the power of effortless store design.
        </p>
      </CalloutCard>
    </div>
  );
}
