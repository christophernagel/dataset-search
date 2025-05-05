// src/data/attributesData.js
export const attributesData = {
    // Community Action Areas
    "Promoting Healthy Child Development": {
      type: "communityActionArea",
      name: "Promoting Healthy Child Development",
      description: "Focuses on programs and datasets that support healthy child development from early childhood through adolescence. These initiatives aim to promote physical health, cognitive development, and emotional well-being.",
      source: "ACT Community Action Areas Framework",
      sourceUrl: "https://example.org/community-action-areas",
      color: "#FF6B6B"
    },
    "Youth Development and Civic Engagement": {
      type: "communityActionArea",
      name: "Youth Development and Civic Engagement",
      description: "Encompasses data related to youth programs, civic participation, and community involvement. This area focuses on building skills and opportunities for young people to become active participants in their communities.",
      source: "ACT Community Action Areas Framework",
      sourceUrl: "https://example.org/community-action-areas",
      color: "#4ECDC4"
    },
    "Creating Protective Environments": {
      type: "communityActionArea",
      name: "Creating Protective Environments",
      description: "Covers datasets related to safety, environmental health, and protective factors in communities. This includes data on crime rates, environmental quality, and other factors that impact community safety.",
      source: "ACT Community Action Areas Framework",
      sourceUrl: "https://example.org/community-action-areas",
      color: "#45B7D1"
    },
    "Strengthening Economic Supports for Children and Families": {
      type: "communityActionArea",
      name: "Strengthening Economic Supports for Children and Families",
      description: "Includes data on economic factors affecting families, such as employment, income, and financial stability. These datasets help identify areas where economic support can improve family outcomes.",
      source: "ACT Community Action Areas Framework",
      sourceUrl: "https://example.org/community-action-areas",
      color: "#98D85B"
    },
    "Access to Safe and Stable Housing": {
      type: "communityActionArea",
      name: "Access to Safe and Stable Housing",
      description: "Features data related to housing affordability, quality, and stability. This area focuses on understanding housing issues that affect community health and stability.",
      source: "ACT Community Action Areas Framework",
      sourceUrl: "https://example.org/community-action-areas",
      color: "#FFD166"
    },
    "Demographic Data": {
      type: "communityActionArea",
      name: "Demographic Data",
      description: "Contains datasets about population characteristics, including age, race, ethnicity, and other demographic factors. This information provides crucial context for understanding community needs.",
      source: "ACT Community Action Areas Framework",
      sourceUrl: "https://example.org/community-action-areas",
      color: "#6A0572"
    },
    
    // Sources
    "PolicyMap": {
      type: "source",
      name: "PolicyMap",
      description: "An online data and mapping tool that provides data on demographics, real estate, health, jobs and more in communities across the US. PolicyMap aggregates data from various authoritative public and private sources.",
      sourceUrl: "https://www.policymap.com/",
      logoUrl: "https://example.org/logos/policymap.png"
    },
    "ACS and Census Data": {
      type: "source",
      name: "ACS and Census Data",
      description: "American Community Survey and US Census Bureau data providing comprehensive demographic, social, economic, and housing information. This data includes both the decennial census and ongoing surveys.",
      sourceUrl: "https://www.census.gov/programs-surveys/acs",
      logoUrl: "https://example.org/logos/census.png"
    },
    "California Department of Social Services": {
      type: "source",
      name: "California Department of Social Services",
      description: "Official data from California's social services agency, covering programs like CalFresh, CalWORKs, and other social support initiatives. Includes enrollment, participation, and outcome metrics.",
      sourceUrl: "https://www.cdss.ca.gov/",
      logoUrl: "https://example.org/logos/cdss.png"
    },
    
    // Categories
    "Public Health": {
      type: "type",
      name: "Public Health",
      description: "Datasets related to community health outcomes, healthcare access, environmental health factors, and public health initiatives. These datasets help track health trends and identify areas for intervention.",
      source: "Healthcare Dataset Classification System",
      sourceUrl: "https://example.org/health-classifications"
    },
    "Community": {
      type: "type",
      name: "Community",
      description: "Data focusing on community characteristics, resources, and quality of life metrics. Includes information on community assets, challenges, and social determinants of health.",
      source: "Healthcare Dataset Classification System",
      sourceUrl: "https://example.org/health-classifications"
    },
    "Educational Records": {
      type: "type",
      name: "Educational Records",
      description: "Educational data including school performance, enrollment, attendance, and achievement metrics. This category helps understand educational outcomes and their relationship to health and well-being.",
      source: "Healthcare Dataset Classification System",
      sourceUrl: "https://example.org/health-classifications"
    },
    
    // Data Formats
    "CSV Collection": {
      type: "dataFormat",
      name: "CSV Collection",
      description: "Data provided in Comma-Separated Values format, allowing for easy import into spreadsheet and database software. CSV is a widely used format for structured data exchange.",
      source: "Data Format Standards",
      sourceUrl: "https://example.org/data-formats"
    },
    "KML Collection": {
      type: "dataFormat",
      name: "KML Collection",
      description: "Keyhole Markup Language format for geographic data visualization. KML files can be used in geographic information system applications, particularly Google Earth and other mapping tools.",
      source: "Data Format Standards",
      sourceUrl: "https://example.org/data-formats"
    }
  };
  
  // Helper function to get attribute by type and value
  export const getAttribute = (type, value) => {
    return attributesData[value] || {
      type: type,
      name: value,
      description: `Information about ${value}`,
      source: "Unknown",
      sourceUrl: "#"
    };
  };