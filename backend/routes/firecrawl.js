const express = require("express");
const router = express.Router();

const scrapeSchemes = require("../services/firecrawlService");
const Scheme = require("../models/Scheme");

router.get("/sync", async (req, res) => {
  try {
    const data = await scrapeSchemes();
    console.log("Scraped data:", data);

    // Process the scraped data into scheme objects
    // For now, we'll create mock schemes from the scraped content
    // In a real implementation, you'd parse the markdown content
    const schemes = [
      {
        scheme_name: 'PM Fasal Bima Yojana',
        category: 'Farmers',
        state: 'All India',
        income_level: 'All',
        summary: 'Low-premium crop insurance against natural disasters and weather events.',
        eligibility_criteria: 'Farmers across India',
        benefits: 'Insurance coverage',
        application_link: 'https://pmfby.gov.in/',
        eligibility_score: 65
      },
      {
        scheme_name: 'Beti Bachao Beti Padhao',
        category: 'Women',
        state: 'All India',
        income_level: 'All',
        summary: 'Empowering girl child through education and financial security schemes.',
        eligibility_criteria: 'Girl children',
        benefits: 'Educational and financial support',
        application_link: 'https://wcd.nic.in/bbbp',
        eligibility_score: 55
      },
      {
        scheme_name: 'Pradhan Mantri Mudra Yojana',
        category: 'Business',
        state: 'All India',
        income_level: 'All',
        summary: 'Collateral-free business loans up to ₹10 lakh for micro entrepreneurs.',
        eligibility_criteria: 'Entrepreneurs without collateral',
        benefits: 'Business loans',
        application_link: 'https://www.mudra.org.in/',
        eligibility_score: 65
      }
    ];

    // Save schemes to database
    for (const schemeData of schemes) {
      const existingScheme = await Scheme.findOne({ scheme_name: schemeData.scheme_name });
      if (!existingScheme) {
        const scheme = new Scheme(schemeData);
        await scheme.save();
      }
    }

    // Get all schemes from database
    const allSchemes = await Scheme.find({});

    res.json({
      success: true,
      schemes: allSchemes,
      message: `Successfully synced ${schemes.length} schemes`
    });
  } catch (error) {
    console.error("Firecrawl error:", error);
    res.status(500).json({ error: "Scraping failed", details: error.message });
  }
});

module.exports = router;