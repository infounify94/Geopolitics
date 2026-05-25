import os
import json
import time
from datetime import datetime
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

def score_topic(topic: dict) -> dict:
    """
    Score a topic 0-100 based on Geopolitical impact and India relevance.
    """
    prompt = f"""You are a senior geopolitical editor for SignalAtlas.
Score this news topic on its relevance for a deep-dive research article.
Topic: {topic['title']}
Context: {topic['description']}

SCORING CRITERIA (0-100 TOTAL):
1. Global Impact (0-30): How many countries/markets affected?
2. India Relevance (0-25): Does it impact India's security, trade, or diplomacy?
3. Pattern Match (0-20): Does it match historical patterns (proxy war, IMF debt, etc)?
4. Search Volume/Interest (0-15): Is this highly searchable?
5. Source Depth (0-10): Is there enough public data to write 2000 words?

Return ONLY valid JSON with this schema:
{{
  "global_impact": 20,
  "india_relevance": 15,
  "pattern_match": 10,
  "search_interest": 10,
  "source_depth": 8,
  "total_score": 63,
  "reasoning": "Brief explanation of why it scored this."
}}
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=200,
        )
        result = json.loads(response.choices[0].message.content)
        result['total_score'] = sum([
            result.get('global_impact', 0),
            result.get('india_relevance', 0),
            result.get('pattern_match', 0),
            result.get('search_interest', 0),
            result.get('source_depth', 0)
        ])
        return result
    except Exception as e:
        print(f"Scoring error: {e}")
        return {"total_score": 0, "reasoning": "Error"}

def filter_top_topics(topics: list[dict], threshold: int = 55) -> list[dict]:
    scored_topics = []
    print("Scoring topics...")
    for t in topics:
        score = score_topic(t)
        t['score_data'] = score
        t['total_score'] = score.get('total_score', 0)
        print(f"[{t['total_score']}/100] {t['title'][:60]}")
        scored_topics.append(t)
        time.sleep(0.5) # rate limit
        
    # Sort and filter
    qualified = [t for t in scored_topics if t['total_score'] >= threshold]
    qualified.sort(key=lambda x: x['total_score'], reverse=True)
    return qualified
