import { CalloutCard } from "@shopify/polaris";
import React from "react";

export default function RequestSection() {
  return (
    <CalloutCard
      title="Didn't find what you were looking for?"
      illustration="/assets/navigationIconsImages/free-trial.svg"
      primaryAction={{
        content: "Request a section",
        url: "#",
        tone: "success",
        variant: "primary",
      }}
    >
      <p>
        Start your risk-free 14-day trial today and experience the power of
        effortless store design.
      </p>
    </CalloutCard>
  );
}
