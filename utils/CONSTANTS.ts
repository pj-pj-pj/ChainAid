const CATEGORIES = [
  {
    name: "Healthcare",
    value: "healthcare",
  },
  {
    name: "Education",
    value: "education",
  },
  {
    name: "Environment",
    value: "environment",
  },
  {
    name: "Water and Sanitation",
    value: "water-and-sanitation",
  },
  {
    name: "Emergency Relief",
    value: "emergency-relief",
  },
  {
    name: "Community Development",
    value: "community-development",
  },
  {
    name: "Other",
    value: "other",
  },
];

export type CATEGORY_TYPE = (typeof CATEGORIES)[number]["value"];

export { CATEGORIES };
