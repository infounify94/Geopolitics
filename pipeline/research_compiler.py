"""
SignalAtlas — Deep Research Compiler
Generates deep, evergreen research articles and dynamically calculates
bidirectional database connections for rich internal linking.
Each run picks from a vast, categorized topic backlog to ensure
maximum subject diversity across all global domains.
"""
import os
import sys
import json
import re
import time
import random
import requests
from datetime import datetime, timezone

# Add parent dir to path
sys.path.insert(0, os.path.dirname(__file__))

from generator import generate_article, slugify
from publisher import publish_article, HEADERS as PUB_HEADERS, SUPABASE_URL

SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# ─────────────────────────────────────────────────────────────────────────────
# MASTER TOPIC BACKLOG — Categorized for diversity rotation
# All topics are factual, evidence-based, and AdSense-safe.
# Written as research analysis, not conspiracy theory.
# ─────────────────────────────────────────────────────────────────────────────

TOPICS_GEOPOLITICAL_CHOKE_POINTS = [
    "Strait of Malacca: The Geopolitical Bottleneck Controlling China's Maritime Energy Lifeline",
    "The Hormuz Factor: How Iran's Naval Positioning Determines Global Oil Price Floors",
    "Suez Canal Revenue Wars: Egypt's Strategic Leverage and the Red Sea Diversion Crisis",
    "The Bab-el-Mandeb Strait: Yemen's Civil War and the Houthi Threat to Global Shipping",
    "Panama Canal Water Levels: How Climate Drought Is Redrawing Global Trade Routes",
    "Taiwan Strait Military Geometry: Why 180km of Water Determines Global Semiconductor Supply",
    "Arctic Passage Opening: How Melting Ice Is Creating a New Russia-Controlled Trade Corridor",
    "The Black Sea Chokepoint: Turkey's Montreux Convention Power in the Ukraine War",
]

TOPICS_ECONOMIC_WARFARE = [
    "Sovereign Debt Lever: How Multilateral Restructuring Reshapes National Resource Ownership in the Global South",
    "The Petrodollar Erosion: SWIFT Alternatives, BRICS Pay, and the Rise of Bilateral Trade Settlements",
    "The Semiconductor Decoupling: Rare Earth Processing, ASML Lithography Bans, and High-Tech Trade Blocks",
    "Lithium Triangle Arbitrage: How South American Nationalization Impacts the Western EV Supply Chain",
    "IMF Structural Adjustment Conditions: Documented Pattern of Privatization Requirements in 42 Borrowing Nations",
    "De-dollarization Mechanics: How China, Russia, and Gulf States Are Building Dollar-Free Trade Architecture",
    "The Belt and Road Debt Trap Debate: Analyzing 139 Infrastructure Loan Terms in 46 Countries",
    "Commodity Price Manipulation: How Chicago Mercantile Exchange Futures Contracts Move Food Prices in Developing Nations",
    "Currency Swap Lines: Why the Fed's Dollar Liquidity Network Is the World's Most Powerful Financial Weapon",
    "Offshore Tax Architecture: How $32 Trillion in Wealth Flows Through 12 Secrecy Jurisdictions",
    "Food Futures Financialization: How Speculative Trading Amplifies Hunger in Import-Dependent Nations",
    "The Resource Curse Mechanics: Why 14 Oil-Rich Nations Have Lower Human Development Than Peers",
]

TOPICS_INSTITUTIONAL_POWER = [
    "Sovereign Infrastructure Capture: The Geopolitics of State-Owned Ports and Grid Ownership",
    "BIS Tower of Basel: How the Bank for International Settlements Coordinates Global Monetary Policy Without Democratic Oversight",
    "World Bank Governance Voting: Why Six Nations Control 44% of Institutional Lending Decisions",
    "The IMF Program Architecture: How Conditionality Clauses Have Shaped Privatization in 78 Countries Since 1980",
    "Credit Rating Agency Power: How Moody's, S&P, and Fitch Determine Which Countries Can Borrow",
    "The WTO Dispute Settlement Crisis: Why the Appellate Body Collapse Paralyzed Global Trade Arbitration",
    "Multilateral Development Bank Conditionality: Energy Transition Loan Terms and National Policy Sovereignty",
    "The FATF Greylist Effect: How Financial Action Task Force Listing Restricts Development Finance Access",
    "Bretton Woods Architecture at 80: Why the 1944 Global Financial Order Still Shapes Inequality",
    "The Basel III Framework: How International Banking Standards Are Written by Private Bankers",
]

TOPICS_SURVEILLANCE_AND_DATA = [
    "The Pegasus Network: NSO Group Clients, Documented Targets, and the Commercial Spyware Industry",
    "China's Social Credit System: What It Actually Measures Versus Western Media Characterization",
    "Palantir's Government Contracts: How One Company Provides Predictive Policing Infrastructure Across 40 Nations",
    "The PRISM Architecture: What Edward Snowden's Documents Revealed About Mass Data Collection and Its Successors",
    "Undersea Cable Surveillance: How Intelligence Agencies Tap the 400 Cables Carrying 99% of Global Internet Traffic",
    "Digital ID Infrastructure: How World Bank-Funded Identity Systems Create New Data Sovereignty Questions",
    "Satellite Imagery Intelligence: How Commercial Satellites Have Democratized Geopolitical Monitoring",
    "The Five Eyes Alliance: Documented Intelligence Sharing Agreements and Their Expansion to 14 Eyes",
    "Mobile Network Backdoors: How Telecommunications Standards Bodies Create Legal Interception Frameworks",
    "Corporate Data Brokerage: How 4,000 Data Broker Companies Trade Personal Information Without Consent",
]

TOPICS_MEDICAL_AND_BIOETHICS = [
    "Dual-Use Dilemmas: Analyzing Pathogen Biosafety and Biotech Funding Networks",
    "Clinical Trial Geography: Why 60% of Phase III Drug Trials Are Conducted in Lower-Income Countries",
    "The Tuskegee Legacy: How Research Ethics Frameworks Changed After the 1972 Syphilis Study Revelation",
    "Pharmaceutical Patent Evergreening: How Drug Companies Extend Monopolies Through 92 Documented Strategies",
    "The TRIPS Agreement Waiver Debate: COVID-19 Vaccine IP Waivers and Access to Medicines in Low-Income Nations",
    "WHO Emergency Use Authorization: How the Process Works, Who Funds It, and What It Does Not Guarantee",
    "Antibiotic Resistance as a Global Security Issue: How Agricultural Overuse Is Creating Untreatable Infections",
    "Bioweapons Convention Verification: Why the 1972 BTWC Has No Inspection Mechanism",
    "Gene Drive Technology: How CRISPR-Based Population Suppression Tools Are Being Debated at the UN",
    "Gain-of-Function Research Funding: A Review of NIH Grant Databases and Published Study Disclosures",
    "Global Vaccine Procurement: How COVAX Purchasing Agreements and Priority Access Shaped the Pandemic Response",
    "Private Equity in Healthcare: How Investment Firms Acquired 800 US Hospitals and Changed Care Delivery",
]

TOPICS_ENVIRONMENTAL_AND_RESOURCES = [
    "Transboundary Water Hegemony: Mekong and Brahmaputra Megadams and the Future of Downstream Sovereignty",
    "Carbon Credit Market Architecture: How Voluntary Carbon Offsets Are Priced, Verified, and Questioned",
    "Geoengineering Governance Gap: Who Is Authorized to Conduct Solar Radiation Management Experiments",
    "Rare Earth Monopoly: How China Controls 85% of Processing Capacity for Critical Technology Minerals",
    "Deep Sea Mining Rights: The International Seabed Authority and Resource Governance in International Waters",
    "Amazon Deforestation Finance: How Soy and Beef Supply Chains Connect European Pension Funds to Forest Loss",
    "The Congo Basin Carbon Sink: Why the World's Second-Largest Rainforest Is Underfunded in Climate Finance",
    "Agricultural Land Acquisition: Documented Foreign Land Purchases in 25 African Nations Since 2008",
    "Water Privatization Outcomes: A Review of 48 Municipal Water System Concessions in Developing Countries",
    "The Green Hydrogen Race: How Germany, Japan, and Australia Are Competing for Renewable Energy Import Corridors",
]

TOPICS_ARMS_AND_CONFLICT = [
    "The Global Arms Trade: How 10 Countries Supply 90% of World Weapons Exports",
    "Proxy War Economics: How External Powers Finance Conflicts Without Direct Military Engagement",
    "Private Military Contractors: The Wagner Group, Blackwater Successors, and the Privatization of War",
    "Nuclear Posture Reviews: How the US, Russia, China, and India Are Modernizing Nuclear Arsenals",
    "Drone Warfare Proliferation: How 100 Countries Now Possess Armed Unmanned Aerial Vehicles",
    "Sanctions as a Weapon: The Effectiveness and Humanitarian Costs of 30 Major Sanction Regimes",
    "The Small Arms Trade: How Surplus NATO Weapons Reach Conflict Zones in Africa and the Middle East",
    "Cyberwarfare Doctrine: How Nations Define, Attribute, and Respond to State-Sponsored Cyber Attacks",
    "Nuclear Non-Proliferation Failures: Why the NPT Has Not Prevented the Addition of New Nuclear States",
    "Autonomous Weapons Systems: How Lethal AI Decision-Making Is Being Regulated, or Not, at the UN",
]

TOPICS_MEDIA_AND_INFORMATION = [
    "State Media Architecture: How Al Jazeera, RT, CGTN, and Voice of America Shape International Narratives",
    "The Advertising Industrial Complex: How Digital Platforms Monetize Political Polarization",
    "Disinformation Infrastructure: Documented Influence Operations by State and Private Actors 2016-2024",
    "Press Freedom Economics: Why 73 Countries Have Passed Laws Restricting Independent Journalism Since 2010",
    "Platform Algorithmic Governance: How Facebook, YouTube, and Twitter Content Moderation Policies Affect Political Speech",
    "The Reuters-AP Duopoly: How Two Wire Services Frame Global Events for 10,000 Downstream Media Outlets",
    "Billionaire Media Ownership: How 15 Individuals Now Own Media Reaching 3 Billion People",
    "Fact-Checking Industry Funding: Who Finances the 300 Global Fact-Checking Organizations",
]

TOPICS_GLOBAL_SOUTH_AND_DEVELOPMENT = [
    "The Debt Sustainability Framework: How IMF and World Bank Jointly Determine Which Countries Are 'Debt Distressed'",
    "Remittance Flow Architecture: How $800 Billion in Annual Migrant Transfers Shape 30 National Economies",
    "Special Economic Zone Economics: China's Model, Global Adoption, and Labor Rights Questions",
    "The Africa Continental Free Trade Area: Implementation Progress, Bottlenecks, and External Interests",
    "Food Import Dependency: How 38 Countries Import More Than 50% of Their Caloric Needs",
    "Colonial Infrastructure Legacy: How 19th-Century Railway and Port Systems Still Determine Trade Patterns",
    "South-South Cooperation Finance: How Brazil, India, China, and Turkey Provide Development Finance Outside DAC",
    "Sovereign Wealth Fund Geopolitics: How Norway, Saudi Arabia, UAE, and Singapore Deploy State Capital Globally",
]

TOPICS_TECHNOLOGY_AND_POWER = [
    "AI Governance Fragmentation: How the EU AI Act, US Executive Orders, and Chinese Regulations Create Three Different AI Worlds",
    "Starlink's Dual-Use Infrastructure: How SpaceX's Satellite Network Functions as Both Commercial and Military Asset",
    "Quantum Computing National Security: Why the NSA, GCHQ, and PLA Are Racing to Break Public-Key Encryption",
    "The Chip War: How US Export Controls on Advanced Semiconductors Are Reshaping the Technology Cold War",
    "Digital Yuan Architecture: How China's Central Bank Digital Currency Enables Programmable Monetary Policy",
    "Cloud Infrastructure Concentration: Why 65% of Global Cloud Runs on Three US Companies",
    "5G Geopolitics: How Huawei Exclusion Decisions Reshaped Telecommunications Infrastructure Investment",
    "Generative AI and Labor Markets: Documented Displacement Patterns in 18 Professional Sectors",
]

# Master pool — all topics combined
EVERGREEN_IDEAS = (
    TOPICS_GEOPOLITICAL_CHOKE_POINTS +
    TOPICS_ECONOMIC_WARFARE +
    TOPICS_INSTITUTIONAL_POWER +
    TOPICS_SURVEILLANCE_AND_DATA +
    TOPICS_MEDICAL_AND_BIOETHICS +
    TOPICS_ENVIRONMENTAL_AND_RESOURCES +
    TOPICS_ARMS_AND_CONFLICT +
    TOPICS_MEDIA_AND_INFORMATION +
    TOPICS_GLOBAL_SOUTH_AND_DEVELOPMENT +
    TOPICS_TECHNOLOGY_AND_POWER
)

def fetch_existing_articles() -> list:
    """Fetch existing articles from Supabase to calculate links and prevent repeats."""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/articles",
        headers=PUB_HEADERS,
        params={"select": "id,slug,title,category,countries,topics", "status": "eq.published"},
    )
    if r.status_code == 200:
        return r.json()
    return []

def calculate_and_insert_connections(new_id: str, new_article: dict, existing_articles: list) -> int:
    """
    Calculate country, topic, and category overlap between the new article and all others.
    Inserts top 3 strongest links bidirectionally into the article_connections table.
    """
    if not existing_articles:
        return 0

    scored_links = []
    new_countries = set(new_article.get("countries", []))
    new_topics = set(new_article.get("topics", []))
    new_cat = new_article.get("category", "")

    for art in existing_articles:
        art_id = art["id"]
        if art_id == new_id:
            continue

        score = 0
        reasons = []

        # Category overlap
        if art.get("category") == new_cat:
            score += 15
            reasons.append(f"Shared theme ({new_cat})")

        # Country overlap
        matching_countries = new_countries.intersection(set(art.get("countries", [])))
        if matching_countries:
            score += len(matching_countries) * 20
            reasons.append(f"Shared country coverage ({', '.join(list(matching_countries)[:2])})")

        # Topic overlap
        matching_topics = new_topics.intersection(set(art.get("topics", [])))
        if matching_topics:
            score += len(matching_topics) * 25
            reasons.append(f"Overlapping strategic keywords ({', '.join(list(matching_topics)[:2])})")

        if score > 0:
            scored_links.append({
                "to_id": art_id,
                "title": art["title"],
                "score": score,
                "reason": " · ".join(reasons) or "Connected strategic analysis"
            })

    # Sort by strongest score first
    scored_links.sort(key=lambda x: x["score"], reverse=True)
    top_links = scored_links[:3]  # Max 3 connections

    connections_created = 0
    for link in top_links:
        # Bidirectional insert: A -> B and B -> A
        strength = min(100, int(link["score"]))
        
        # 1. Forward direction
        conn_forward = {
            "from_article": new_id,
            "to_article": link["to_id"],
            "connection_strength": strength,
            "connection_reason": link["reason"]
        }
        r1 = requests.post(
            f"{SUPABASE_URL}/rest/v1/article_connections",
            headers=PUB_HEADERS,
            json=conn_forward
        )
        
        # 2. Reverse direction
        conn_reverse = {
            "from_article": link["to_id"],
            "to_article": new_id,
            "connection_strength": strength,
            "connection_reason": link["reason"]
        }
        r2 = requests.post(
            f"{SUPABASE_URL}/rest/v1/article_connections",
            headers=PUB_HEADERS,
            json=conn_reverse
        )
        
        if r1.status_code in (200, 201) or r2.status_code in (200, 201):
            connections_created += 1
            print(f"  ✓ Connected: \"{new_article['title'][:30]}\" ↔ \"{link['title'][:30]}\" (Strength: {strength})")

    return connections_created

def run_compiler(manual_topic: str = None) -> None:
    print(f"\n{'='*60}")
    print(f"SignalAtlas Deep Research Compiler - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    existing = fetch_existing_articles()
    existing_slugs = {a["slug"] for a in existing}
    existing_titles = {a["title"] for a in existing}

    # Decide topic
    topic = ""
    if manual_topic and manual_topic.strip():
        topic = manual_topic.strip()
        print(f"Manual Research Triggered for topic: \"{topic}\"")
    else:
        # Pick one that isn't published yet — shuffle for category diversity
        available = [t for t in EVERGREEN_IDEAS if slugify(t) not in existing_slugs and t not in existing_titles]
        if not available:
            print(f"All {len(EVERGREEN_IDEAS)} evergreen topics are already published. Selecting random topic for refresh...")
            topic = random.choice(EVERGREEN_IDEAS)
        else:
            # Weighted shuffle: pick from the first 20 available to maintain some order
            # but inject randomness so we don't always hammer the same category
            pool = available[:20] if len(available) > 20 else available
            topic = random.choice(pool)
            print(f"Selected from {len(available)} unpublished topics ({len(EVERGREEN_IDEAS)} total in backlog)")
        print(f"Auto-selected: \"{topic}\"")

    # Double check slug
    target_slug = slugify(topic)
    if target_slug in existing_slugs:
        print(f"  ⚠ Research aborted: Slug \"{target_slug}\" is already published.")
        return

    # Generate
    print(f"Executing Deep 17-Angle Synthesis Compiler...")
    article = generate_article(topic, context="Ensure an extremely high standard of writing, strong citations, dynamic 3 scenarios, and detailed India Implications lens.")
    
    if not article:
        print("  ✗ Generation failed.")
        return

    # Publish
    print(f"Publishing to Supabase Database...")
    new_id = publish_article(article)

    if new_id:
        print(f"  ✓ Deep Briefing fully published with ID: {new_id}")
        
        # Calculate dynamic links
        print(f"Calculating dynamic internal links for Relationship Graph & Sidebar...")
        links_inserted = calculate_and_insert_connections(new_id, article, existing)
        print(f"  ✓ Graph calculation complete: {links_inserted} bidirectional links established.")
        
        # Cache local published topic
        from scheduler import save_published_topic
        save_published_topic(topic)
        
        print(f"\nLive at: /research/{article['slug']}")
    else:
        print("  ✗ Publishing failed.")

    print(f"{'='*60}\n")

if __name__ == "__main__":
    manual_input = sys.argv[1] if len(sys.argv) > 1 else None
    run_compiler(manual_input)
