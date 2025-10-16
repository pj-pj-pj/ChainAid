const CATEGORIES = [
  {
    name: "Healthcare",
    value: "Healthcare",
  },
  {
    name: "Education",
    value: "Education",
  },
  {
    name: "Environment",
    value: "Environment",
  },
  {
    name: "Water and Sanitation",
    value: "Water and Sanitation",
  },
  {
    name: "Emergency Relief",
    value: "Emergency Relief",
  },
  {
    name: "Community Development",
    value: "Community Development",
  },
  {
    name: "Other",
    value: "Other",
  },
];

export type CATEGORY_TYPE = (typeof CATEGORIES)[number]["value"];

export { CATEGORIES };
