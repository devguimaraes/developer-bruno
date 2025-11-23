// TestSprite Test Configuration for Bruno's Portfolio
// This file defines test cases for the portfolio website

const testCases = [
  {
    name: "Homepage Load and Basic Navigation",
    url: "http://localhost:8082/",
    tests: [
      "Page loads successfully",
      "Navigation component is visible",
      "Logo is clickable",
      "All navigation links are present"
    ]
  },

  {
    name: "Mobile Menu Functionality",
    url: "http://localhost:8082/",
    viewport: { width: 375, height: 667 }, // Mobile viewport
    tests: [
      "Hamburger menu is visible on mobile",
      "Clicking hamburger opens mobile menu",
      "Mobile menu contains all navigation links",
      "Clicking outside closes mobile menu"
    ]
  },

  {
    name: "Smooth Scrolling Navigation",
    url: "http://localhost:8082/",
    tests: [
      "Click navigation links scroll to correct sections",
      "Smooth scrolling behavior works",
      "URL hash updates correctly",
      "Section highlighting works"
    ]
  },

  {
    name: "Contact Section Functionality",
    url: "http://localhost:8082/#contact",
    tests: [
      "Contact section is visible",
      "All social media links are present",
      "Social media links open in new tabs",
      "Hover effects work on social icons",
      "Call-to-action button is clickable"
    ]
  },

  {
    name: "Responsive Design Testing",
    url: "http://localhost:8082/",
    viewports: [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ],
    tests: [
      "Layout adapts to different screen sizes",
      "Navigation changes appropriately",
      "Text remains readable",
      "No horizontal scrolling"
    ]
  },

  {
    name: "External Link Validation",
    url: "http://localhost:8082/",
    tests: [
      "LinkedIn link opens correct profile",
      "GitHub link opens correct profile",
      "Instagram link opens correct profile"
    ]
  },

  {
    name: "Visual Design Consistency",
    url: "http://localhost:8082/",
    tests: [
      "Brutalist design elements are consistent",
      "Color scheme matches design system",
      "Borders and shadows are applied correctly",
      "Typography is consistent"
    ]
  }
];

export default testCases;