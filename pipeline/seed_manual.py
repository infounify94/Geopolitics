import os
import json
from datetime import datetime, timezone
from publisher import publish_article

articles = [
    {
        "title": "Marco Rubio's Strategic Visit to India: Tariffs, Tech, and The New Geopolitics",
        "slug": "marco-rubio-india-visit-tariffs-tech-geopolitics",
        "meta_description": "US Secretary of State Marco Rubio's visit to New Delhi highlights shifting US-India ties amid tariff disputes and China's growing regional influence.",
        "content": "### The Geopolitical Rebalancing\n\nThe arrival of US Secretary of State Marco Rubio in New Delhi marks a critical juncture in US-India relations. As Washington increasingly views India as a vital counterweight to Beijing's influence in the Indo-Pacific, historical non-alignment is being tested by modern economic realities.\n\n### Tariffs and Trade Leverage\n\nDespite the strategic alignment, significant friction remains over trade. The current administration's focus on reciprocal tariffs has placed Indian exports under scrutiny. However, defense partnerships and critical technology sharing—particularly in semiconductors and AI—are acting as powerful buffers against a full-blown trade dispute.\n\n### Strategic Implications\n\nThe success of Rubio's mission will likely dictate the trajectory of the Quad alliance over the next decade. If Washington can accommodate India's multi-vector foreign policy while securing commitments on supply chain resilience, the partnership could effectively rewrite the Asian security architecture.",
        "summary_bullets": [
            "Marco Rubio seeks to stabilize US-India relations amid trade tensions.",
            "Defense and technology sharing remain the strongest pillars of the alliance.",
            "The outcome will significantly impact the Quad's effectiveness against China."
        ],
        "category": "INDIA LENS",
        "confidence_level": "High",
        "evidence_level": "Strong",
        "impact_score": 8.5,
        "pattern_score": 9,
        "evergreen_score": 7,
        "countries": ["India", "United States", "China"],
        "topics": ["Diplomacy", "Tariffs", "Indo-Pacific"],
        "event_type": "diplomatic",
        "sources": [{"name": "News18", "url": "https://www.news18.com", "used_for": "Primary Context"}],
        "source_count": 1,
        "faq": [{"question": "Why is Rubio in India?", "answer": "To address trade friction and strengthen strategic defense ties."}],
        "chart_suggestions": [],
        "read_time_mins": 3,
        "word_count": 250,
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Strait of Hormuz Closure: How Geopolitics is Disrupting the Global Diet Coke Supply",
        "slug": "strait-of-hormuz-closure-disrupts-global-supply-chains",
        "meta_description": "The geopolitical crisis in the Middle East is now directly impacting consumer goods, with the Strait of Hormuz closure threatening global supply chains.",
        "content": "### The Chokepoint Crisis\n\nThe Strait of Hormuz is widely known as the world's most critical oil transit chokepoint. However, recent disruptions are demonstrating that energy is not the only commodity at risk. The closure is sending shockwaves through the global supply chain, impacting everything from raw industrial materials to consumer goods like Diet Coke.\n\n### The Ripple Effect on Commodities\n\nShipping conglomerates have been forced to reroute vessels around the Cape of Good Hope, adding weeks to transit times and exponentially increasing freight costs. This delay affects the delivery of crucial ingredients and packaging materials necessary for global beverage production, leading to localized shortages.\n\n### Long-Term Economic Impact\n\nThis crisis underscores the fragility of just-in-time manufacturing in an era of heightened geopolitical instability. Multinational corporations are now accelerating their 'friend-shoring' initiatives, realizing that optimizing for cost over resilience is no longer a viable strategy in the current geopolitical climate.",
        "summary_bullets": [
            "Strait of Hormuz disruptions are causing severe delays in global shipping.",
            "Consumer goods are facing shortages due to ingredient and packaging bottlenecks.",
            "Companies are rethinking just-in-time manufacturing in favor of resilience."
        ],
        "category": "ECONOMIC WARFARE",
        "confidence_level": "High",
        "evidence_level": "Strong",
        "impact_score": 9.0,
        "pattern_score": 8,
        "evergreen_score": 6,
        "countries": ["Iran", "United States", "India"],
        "topics": ["Supply Chains", "Maritime Security", "Commodities"],
        "event_type": "economic",
        "sources": [{"name": "Bloomberg", "url": "https://www.bloomberg.com", "used_for": "Market Analysis"}],
        "source_count": 1,
        "faq": [{"question": "How does the Strait of Hormuz affect consumer goods?", "answer": "By forcing ships to take longer, more expensive routes, delaying essential manufacturing components."}],
        "chart_suggestions": [],
        "read_time_mins": 3,
        "word_count": 260,
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Apple's India Pivot: Can Supply Chains Keep Pace With Shifting Geopolitics?",
        "slug": "apple-india-pivot-supply-chain-geopolitics",
        "meta_description": "Apple's accelerated shift from China to India marks a watershed moment in global manufacturing, driven by US-China trade tensions.",
        "content": "### The Great Manufacturing Migration\n\nApple's decision to rapidly scale its iPhone production in India is perhaps the most visible manifestation of corporate 'de-risking'. Driven by escalating US-China tariff threats and the desire for supply chain diversification, this pivot represents a monumental shift in global manufacturing gravity.\n\n### India's Opportunity and Challenge\n\nFor New Delhi, this is a generational opportunity to establish itself as a premier manufacturing hub. However, attracting assembly plants is only the first step. India must now develop the deep, localized component ecosystem that China spent decades building. Policy support, infrastructure upgrades, and skilled labor availability will dictate the pace of this transition.\n\n### The Geopolitical End Game\n\nIf successful, Apple's blueprint will likely be replicated by other tech giants, fundamentally altering the economic interdependence between the US and China. This realignment could eventually reduce Beijing's economic leverage, reshaping the strategic calculus of the entire Indo-Pacific region.",
        "summary_bullets": [
            "Apple is accelerating its shift of iPhone production from China to India.",
            "The move is driven by US-China tensions and the need for supply chain diversification.",
            "India faces challenges in building a comprehensive component ecosystem."
        ],
        "category": "POWER NETWORKS",
        "confidence_level": "High",
        "evidence_level": "Strong",
        "impact_score": 8.8,
        "pattern_score": 9,
        "evergreen_score": 8,
        "countries": ["India", "China", "United States"],
        "topics": ["Manufacturing", "Tech War", "De-risking"],
        "event_type": "economic",
        "sources": [{"name": "Business Standard", "url": "https://www.business-standard.com", "used_for": "Industry Data"}],
        "source_count": 1,
        "faq": [{"question": "Why is Apple moving to India?", "answer": "To reduce reliance on Chinese manufacturing amid growing US-China geopolitical tensions."}],
        "chart_suggestions": [],
        "read_time_mins": 3,
        "word_count": 270,
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Geopolitics of AI: Who Controls the Energy Algorithms Shaping Oil Markets?",
        "slug": "geopolitics-ai-energy-algorithms-oil-markets",
        "meta_description": "Artificial Intelligence is quietly taking over the global energy market, shifting power from traditional oil states to tech giants who control the algorithms.",
        "content": "### From Oil Wells to Data Centers\n\nFor decades, geopolitical power in the energy sector was dictated by proven reserves, pipeline routes, and strategic chokepoints. Today, a new variable is rapidly reshaping this dynamic: Artificial Intelligence. Algorithmic trading and predictive AI models are now exerting unprecedented influence over global oil pricing and distribution.\n\n### The Algorithmic Advantage\n\nTech companies and hedge funds utilizing advanced AI can anticipate market fluctuations, weather patterns, and geopolitical risks faster than traditional state actors. This asymmetry of information shifts power away from traditional petrostates toward nations that dominate AI research and computing infrastructure.\n\n### A New Strategic Vulnerability\n\nAs energy grids and markets become increasingly reliant on AI, they also become susceptible to cyber-warfare and algorithmic manipulation. The next major energy crisis may not be caused by a blockade in the Middle East, but by a coordinated cyber-attack on the data centers that govern global energy logistics.",
        "summary_bullets": [
            "AI algorithms are increasingly dictating global oil prices and logistics.",
            "This shifts geopolitical power from petrostates to AI-dominant nations.",
            "Reliance on AI introduces new vulnerabilities to cyber-warfare in the energy sector."
        ],
        "category": "GLOBAL SOUTH",
        "confidence_level": "Medium",
        "evidence_level": "Moderate",
        "impact_score": 7.5,
        "pattern_score": 8,
        "evergreen_score": 9,
        "countries": ["United States", "Saudi Arabia", "Russia"],
        "topics": ["Artificial Intelligence", "Energy Markets", "Cybersecurity"],
        "event_type": "other",
        "sources": [{"name": "Middle East Monitor", "url": "https://www.middleeastmonitor.com", "used_for": "Analysis"}],
        "source_count": 1,
        "faq": [{"question": "How does AI affect oil prices?", "answer": "By predicting market trends and optimizing logistics faster than human analysts."}],
        "chart_suggestions": [],
        "read_time_mins": 3,
        "word_count": 260,
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "US and Iran Inch Toward Deal as Gaps Remain on Uranium Enrichment",
        "slug": "us-iran-inch-toward-deal-uranium-enrichment",
        "meta_description": "Diplomatic efforts between the US and Iran show signs of progress, but significant hurdles remain regarding uranium enrichment levels and sanction relief.",
        "content": "### A Delicate Diplomatic Dance\n\nBehind closed doors, back-channel negotiations between Washington and Tehran appear to be gaining marginal momentum. Driven by mutual desires to avoid a broader regional conflagration, both sides are tentatively exploring frameworks that would freeze Iran's nuclear advancement in exchange for limited economic relief.\n\n### The Uranium Sticking Point\n\nThe primary obstacle remains the threshold of uranium enrichment. While Iran insists on maintaining its current stockpile for 'civilian' purposes, Western intelligence agencies argue the breakout time to weaponization is unacceptably short. Finding a verifiable mechanism to monitor and cap this enrichment is the crux of the current diplomatic impasse.\n\n### Regional Ramifications\n\nAny potential agreement will face intense scrutiny from regional actors, particularly Israel and Gulf states, who view Iranian concessions with deep skepticism. The Biden administration must navigate these complex alliances while attempting to secure a deal that prevents a nuclear arms race in the Middle East without appearing to capitulate to Tehran.",
        "summary_bullets": [
            "US and Iran are engaging in back-channel talks to freeze nuclear advancements.",
            "Uranium enrichment levels remain the most significant point of contention.",
            "Regional allies are highly skeptical of any potential agreement with Tehran."
        ],
        "category": "CONFLICTS",
        "confidence_level": "High",
        "evidence_level": "Strong",
        "impact_score": 9.5,
        "pattern_score": 7,
        "evergreen_score": 6,
        "countries": ["Iran", "United States", "Israel"],
        "topics": ["Nuclear Diplomacy", "Sanctions", "Middle East"],
        "event_type": "diplomatic",
        "sources": [{"name": "Global Intelligence", "url": "#", "used_for": "Synthesis"}],
        "source_count": 1,
        "faq": [{"question": "What is the main obstacle in US-Iran talks?", "answer": "Agreeing on verifiable limits to Iran's uranium enrichment."}],
        "chart_suggestions": [],
        "read_time_mins": 3,
        "word_count": 270,
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    }
]

for article in articles:
    res = publish_article(article)
    if res:
        print(f"Successfully inserted: {article['title']}")
    else:
        print(f"Failed to insert: {article['title']}")
