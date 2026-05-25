import os
import json
from openai import OpenAI

# We use the same Groq API key (free, fast tier) for scoring
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY") or "dummy_key",
    base_url="https://api.groq.com/openai/v1",
)

def score_topics(topics: list[dict]) -> list[dict]:
    """
    Pass the list of topics to the LLM to score them based on:
    - Global Impact (0-30)
    - India Relevance (0-25)
    - Pattern Match (0-20)
    - Search Volume / Interest (0-15)
    - Source Depth (0-10)
    Total: 100.
    Returns only topics with score >= 55, sorted by score descending.
    """
    if not topics:
        return []

    print(f"Scoring {len(topics)} topics via AI pipeline...")

    # We batch them to save time, sending up to 15 topics at once to the LLM
    scored_topics = []
    
    # Process in batches of 15
    batch_size = 15
    for i in range(0, len(topics), batch_size):
        batch = topics[i:i+batch_size]
        
        prompt = "Evaluate the following news topics for a geopolitical research publication.\n\n"
        prompt += "SCORING MATRIX:\n"
        prompt += "- global_impact (0-30): How many countries affected\n"
        prompt += "- india_relevance (0-25): Direct India connection score\n"
        prompt += "- pattern_match (0-20): Matches known historical patterns (proxy war, economic warfare, protest blueprint)\n"
        prompt += "- interest_volume (0-15): Expected public interest\n"
        prompt += "- source_depth (0-10): Is it a substantive geopolitical event?\n\n"
        
        for idx, t in enumerate(batch):
            prompt += f"Topic [{idx}]: {t['title']} | Summary: {t['description'][:200]}\n"
            
        prompt += """
Respond ONLY with a JSON object in this exact format:
{
  "scores": [
    {
      "index": 0,
      "score": 85
    },
    {
      "index": 1,
      "score": 42
    }
  ]
}
"""

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a senior geopolitical analyst scoring research topics. Respond ONLY in strict JSON format."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=1024,
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            raw = response.choices[0].message.content
            result = json.loads(raw)
            
            for item in result.get("scores", []):
                idx = item.get("index")
                score = item.get("score", 0)
                if idx is not None and idx < len(batch):
                    t = batch[idx]
                    t["topic_score"] = score
                    scored_topics.append(t)
                    
        except Exception as e:
            print(f"Error scoring batch {i//batch_size}: {e}")
            # Fallback: assign a default passing score so we don't lose the topics if API fails
            for t in batch:
                t["topic_score"] = 60
                scored_topics.append(t)

    # Filter >= 55 and sort descending
    passed = [t for t in scored_topics if t.get("topic_score", 0) >= 55]
    passed.sort(key=lambda x: x.get("topic_score", 0), reverse=True)
    
    print(f"Scoring complete. {len(passed)}/{len(topics)} topics passed threshold (>=55).")
    return passed

if __name__ == "__main__":
    dummy_topics = [
        {"title": "Global stock markets plunge amid new US-China trade tariffs", "description": "Markets reacted strongly today to the new sanctions."},
        {"title": "Local cat rescued from tree in Ohio", "description": "Firefighters saved a stranded kitten."},
        {"title": "India signs strategic deep-water port deal with Iran", "description": "A major shift in Indian Ocean power dynamics."}
    ]
    results = score_topics(dummy_topics)
    for r in results:
        print(f"Score: {r['topic_score']} | {r['title']}")
