"""
PocketSmart AI - Gemini Utilities & Multi-Platform Recommendation Engine
Handles prompts, Gemini API invocation, JSON extraction, and shopping links enrichment.
"""

import os
import re
import json
import urllib.parse
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Try importing Google GenAI SDK
try:
    from google import genai
    from google.genai import types
    GENAI_NEW_SDK = True
except ImportError:
    try:
        import google.generativeai as genai_legacy
        GENAI_NEW_SDK = False
    except ImportError:
        GENAI_NEW_SDK = False

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

# Initialize Gemini Client
client = None
if API_KEY:
    try:
        if GENAI_NEW_SDK:
            client = genai.Client(api_key=API_KEY)
        else:
            genai_legacy.configure(api_key=API_KEY)
    except Exception as e:
        print(f"Warning: Could not initialize Gemini API: {e}")


def extract_json_from_response(text: str) -> dict:
    """Extract and parse JSON safely from Gemini's response text."""
    if not text:
        return {}
    
    # Strip markdown code blocks ```json ... ```
    cleaned = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()
    
    try:
        return json.loads(cleaned)
    except Exception:
        # Fallback to search first { and last }
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            try:
                return json.loads(cleaned[start:end+1])
            except Exception as e:
                print(f"JSON parsing error: {e}")
    return {}


def get_home_recommendations(budget_input) -> dict:
    """Generate home interior recommendations within budget for Indian market."""
    total_budget = float(budget_input.total_budget)
    
    rooms_list = []
    if getattr(budget_input, 'has_living_room', False):
        rooms_list.append("Living room")
    if getattr(budget_input, 'has_kitchen', False):
        rooms_list.append("Kitchen")
    if getattr(budget_input, 'has_bedroom', False):
        rooms_list.append("Bedroom")
    
    prompt = f"""
I need interior design product recommendations for a home in India with a total budget of ₹{total_budget:.2f}.
Requirements:
- {budget_input.num_lights} lights/lighting fixtures
- {budget_input.num_fans} ceiling fans
- {budget_input.num_furniture} furniture pieces
- {budget_input.num_dining_tables} dining tables

Additional rooms to consider:
{', '.join(rooms_list) if rooms_list else 'Living Room, Bedroom'}

Additional requirements: {budget_input.additional_requirements or 'None'}

Please provide a detailed budget breakdown with product recommendations **available in India**.
Use **Indian brands and pricing**. Include **search terms** suitable for Indian shopping platforms.

Format your response as JSON with the following structure:
{{
  "total_budget": {total_budget:.2f},
  "budget_breakdown": [
    {{
      "category": "Lighting",
      "allocation": 0.0,
      "items": [
        {{
          "name": "",
          "description": "",
          "estimated_price": 0.0,
          "quantity": 0,
          "search_terms": ""
        }}
      ]
    }}
  ],
  "remaining_budget": 0.0,
  "additional_suggestions": []
}}

Ensure total costs stay within budget. Include search terms for each item to find on shopping websites like Flipkart, Amazon India, IKEA.
"""
    result = {}
    if client and API_KEY:
        try:
            if GENAI_NEW_SDK:
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                result = extract_json_from_response(response.text)
            else:
                model = genai_legacy.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                result = extract_json_from_response(response.text)
        except Exception as e:
            print(f"Error calling Gemini in get_home_recommendations: {e}")

    # Fallback if AI response missing or failed
    if not result or "budget_breakdown" not in result:
        alloc_light = round(total_budget * 0.25)
        alloc_fans = round(total_budget * 0.35)
        alloc_furn = round(total_budget * 0.30)
        result = {
            "total_budget": total_budget,
            "budget_breakdown": [
                {
                    "category": "Lighting",
                    "allocation": alloc_light,
                    "items": [
                        {
                            "name": "Philips / Wipro Warm White LED Bulbs (Pack)",
                            "description": "High-lumen energy efficient ambient lighting for Indian homes.",
                            "estimated_price": max(150, round(alloc_light / max(1, budget_input.num_lights))),
                            "quantity": max(1, budget_input.num_lights),
                            "search_terms": "Philips B22 warm white LED bulb pack"
                        }
                    ]
                },
                {
                    "category": "Ceiling Fans",
                    "allocation": alloc_fans,
                    "items": [
                        {
                            "name": "Havells / Crompton High Speed 1200mm Fan",
                            "description": "Durable copper motor ceiling fan with rust-free blades.",
                            "estimated_price": max(1200, round(alloc_fans / max(1, budget_input.num_fans))),
                            "quantity": max(1, budget_input.num_fans),
                            "search_terms": "Havells 1200mm high speed ceiling fan"
                        }
                    ]
                },
                {
                    "category": "Furniture",
                    "allocation": alloc_furn,
                    "items": [
                        {
                            "name": "Engineered Wood Coffee / Dining Accent Table",
                            "description": "Space-efficient modern table with rich walnut/teak finish.",
                            "estimated_price": alloc_furn,
                            "quantity": 1,
                            "search_terms": "engineered wood compact dining table"
                        }
                    ]
                }
            ],
            "additional_suggestions": [
                "Consider purchasing refurbished or modular furniture for further cost savings.",
                "Check festive sale offers on Amazon India, Flipkart, and IKEA.",
                "Prioritize high-use appliances before decorative items."
            ]
        }

    # Add shopping links for each item
    calculation_table = []
    total_allocated = 0
    for category in result.get("budget_breakdown", []):
        cat_cost = 0
        cat_count = 0
        for item in category.get("items", []):
            search_terms = item.get("search_terms", item.get("name", ""))
            encoded_query = urllib.parse.quote_plus(search_terms)
            item["shopping_links"] = {
                "amazon": f"https://www.amazon.in/s?k={encoded_query}",
                "flipkart": f"https://www.flipkart.com/search?q={encoded_query}",
                "ikea": f"https://www.ikea.com/in/en/search/?q={encoded_query}",
                "myntra": f"https://www.myntra.com/search?q={encoded_query}",
                "ajio": f"https://www.ajio.com/search/?text={encoded_query}"
            }
            cost = item.get("estimated_price", 0) * item.get("quantity", 1)
            cat_cost += cost
            cat_count += item.get("quantity", 1)
        total_allocated += cat_cost
        calculation_table.append({
            "category": category.get("category", "General"),
            "items_count": cat_count,
            "total_cost": cat_cost,
            "percentage_of_budget": round((cat_cost / total_budget) * 100, 1) if total_budget > 0 else 0
        })

    result["calculation_table"] = calculation_table
    result["remaining_budget"] = max(0.0, total_budget - total_allocated)
    return result


def get_party_recommendations(budget_input) -> dict:
    """Generate party planning recommendations within budget for Indian market."""
    total_budget = float(budget_input.total_budget)
    prompt = f"""
I need party planning recommendations for India with a total budget of ₹{total_budget:.2f}.
Party details:
- Type: {budget_input.party_type}
- Number of guests: {budget_input.num_guests}
- Venue type: {budget_input.venue_type or 'Not specified'}
- Catering needed: {"Yes" if budget_input.needs_catering else "No"}
- Decoration needed: {"Yes" if budget_input.needs_decoration else "No"}
- Entertainment needed: {"Yes" if budget_input.needs_entertainment else "No"}
Additional requirements: {budget_input.additional_requirements or 'None'}

Please provide a detailed budget breakdown with specific recommendations available in India using INR prices.
Use Indian brands, services, and typical cost expectations.

Format your response as JSON with the following structure:
{{
  "total_budget": {total_budget:.2f},
  "budget_breakdown": [
    {{
      "category": "catering",
      "allocation": 0.0,
      "items": [
        {{
          "name": "",
          "description": "",
          "estimated_price": 0.0,
          "quantity": 0,
          "search_terms": ""
        }}
      ]
    }}
  ],
  "venue_suggestions": [
    {{
      "name": "",
      "type": "",
      "capacity": 0,
      "estimated_cost": 0.0,
      "search_terms": ""
    }}
  ],
  "remaining_budget": 0.0,
  "additional_suggestions": []
}}
"""
    result = {}
    if client and API_KEY:
        try:
            if GENAI_NEW_SDK:
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(response_mime_type="application/json")
                )
                result = extract_json_from_response(response.text)
            else:
                model = genai_legacy.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                result = extract_json_from_response(response.text)
        except Exception as e:
            print(f"Error calling Gemini in get_party_recommendations: {e}")

    # Fallback party plan
    if not result or "budget_breakdown" not in result:
        food_alloc = round(total_budget * 0.45)
        decor_alloc = round(total_budget * 0.25)
        ent_alloc = round(total_budget * 0.20)
        result = {
            "total_budget": total_budget,
            "budget_breakdown": [
                {
                    "category": "Catering",
                    "allocation": food_alloc,
                    "items": [
                        {
                            "name": "Party Platter Combo Meal",
                            "description": f"Curated appetizers and main course for {budget_input.num_guests} guests.",
                            "estimated_price": food_alloc,
                            "quantity": 1,
                            "search_terms": "party combo platter meals catering"
                        }
                    ]
                },
                {
                    "category": "Decoration",
                    "allocation": decor_alloc,
                    "items": [
                        {
                            "name": "Themed Balloon Arch and Banner Set",
                            "description": "Vibrant party decor with balloons, streamers and lights.",
                            "estimated_price": decor_alloc,
                            "quantity": 1,
                            "search_terms": f"{budget_input.party_type} celebration decoration kit"
                        }
                    ]
                },
                {
                    "category": "Entertainment",
                    "allocation": ent_alloc,
                    "items": [
                        {
                            "name": "Party Games & Music Playlist Subscription",
                            "description": "Fun trivia and premium music streaming access.",
                            "estimated_price": ent_alloc,
                            "quantity": 1,
                            "search_terms": "party games and music subscription"
                        }
                    ]
                }
            ],
            "venue_suggestions": [
                {
                    "name": "Cozy Home / Private Rooftop Space",
                    "type": "Residential",
                    "capacity": budget_input.num_guests + 4,
                    "estimated_cost": 0.0,
                    "search_terms": "home celebration party space"
                }
            ],
            "additional_suggestions": [
                "Order catering meals early to avoid rush delivery delays.",
                "Create a shared playlist so guests can queue up favorite tracks."
            ]
        }

    # Add category shopping & booking links
    category_platforms = {
        "venue": ["google", "booking", "makemytrip", "oyorooms", "nobroker"],
        "catering": ["swiggy", "zomato", "bigbasket", "amazon", "flipkart"],
        "food": ["swiggy", "zomato", "bigbasket", "amazon", "flipkart"],
        "drinks": ["swiggy", "zomato", "bigbasket", "amazon", "flipkart"],
        "decoration": ["amazon", "flipkart", "meesho", "myntra"],
        "entertainment": ["bookmyshow", "amazon", "flipkart"],
        "gifts": ["amazon", "flipkart", "myntra", "meesho"],
        "contingency": ["amazon", "flipkart", "google"]
    }

    default_platforms = ["amazon", "flipkart", "google"]
    calculation_table = []
    total_allocated = 0

    for category in result.get("budget_breakdown", []):
        cat_name = category.get("category", "").lower()
        relevant_platforms = category_platforms.get(cat_name, default_platforms)
        cat_cost = 0
        cat_count = 0

        for item in category.get("items", []):
            search_terms = item.get("search_terms", item.get("name", ""))
            encoded_query = urllib.parse.quote_plus(search_terms)
            shopping_links = {}

            if "amazon" in relevant_platforms:
                shopping_links["amazon"] = f"https://www.amazon.in/s?k={encoded_query}"
            if "flipkart" in relevant_platforms:
                shopping_links["flipkart"] = f"https://www.flipkart.com/search?q={encoded_query}"
            if "swiggy" in relevant_platforms:
                shopping_links["swiggy"] = f"https://www.swiggy.com/search?query={encoded_query}"
            if "zomato" in relevant_platforms:
                shopping_links["zomato"] = f"https://www.zomato.com/search?q={encoded_query}"
            if "bigbasket" in relevant_platforms:
                shopping_links["bigbasket"] = f"https://www.bigbasket.com/ps/?q={encoded_query}"
            if "bookmyshow" in relevant_platforms:
                shopping_links["bookmyshow"] = f"https://in.bookmyshow.com/search?q={encoded_query}"
            if "meesho" in relevant_platforms:
                shopping_links["meesho"] = f"https://www.meesho.com/search?q={encoded_query}"
            if "google" in relevant_platforms:
                shopping_links["google"] = f"https://www.google.com/search?q={encoded_query}"

            item["shopping_links"] = shopping_links
            cost = item.get("estimated_price", 0) * item.get("quantity", 1)
            cat_cost += cost
            cat_count += item.get("quantity", 1)

        total_allocated += cat_cost
        calculation_table.append({
            "category": category.get("category", "General"),
            "items_count": cat_count,
            "total_cost": cat_cost,
            "percentage_of_budget": round((cat_cost / total_budget) * 100, 1) if total_budget > 0 else 0
        })

    # Enrich venue suggestions
    for venue in result.get("venue_suggestions", []):
        encoded_query = urllib.parse.quote_plus(venue.get("search_terms", venue.get("name", "")))
        venue["shopping_links"] = {
            "google": f"https://www.google.com/search?q={encoded_query}",
            "booking": f"https://www.booking.com/search.html?ss={encoded_query}",
            "makemytrip": f"https://www.makemytrip.com/hotels/hotel-listing/?searchText={encoded_query}",
            "oyorooms": f"https://www.oyorooms.com/search/?location={encoded_query}",
            "nobroker": f"https://www.nobroker.in/property/search/searchterm={encoded_query}"
        }

    result["calculation_table"] = calculation_table
    result["remaining_budget"] = max(0.0, total_budget - total_allocated)
    return result


def get_jewelry_recommendations(budget_input, image_path: Optional[str] = None) -> dict:
    """Generate jewelry recommendations with optional outfit image analysis."""
    total_budget = float(budget_input.total_budget)
    base_prompt = f"""
I need jewelry recommendations for India with a total budget of ₹{total_budget:.2f}.
Occasion: {budget_input.occasion}
Preferences: {budget_input.preferences or "Not specified"}
Provide only India-relevant styles, availability, and price ranges in INR.
"""
    result = {}
    if image_path and os.path.exists(image_path):
        from PIL import Image
        try:
            img = Image.open(image_path)
            prompt = base_prompt + """
An image of the outfit is uploaded. Suggest jewelry that complements it, considering color, design, and occasion appropriateness.
Format the output as JSON:
{
  "total_budget": 0.0,
  "outfit_analysis": {
    "colors": ["#1e3a8a", "#ffffff"],
    "style": "Casual Chic",
    "formality": "Semi-Formal",
    "rationale": "Complementing outfit colors..."
  },
  "jewelry_recommendations": [
    {
      "item_type": "bracelet",
      "name": "Silver Accent Bracelet",
      "description": "Understated bracelet with clean finish.",
      "style": "Modern Minimalist",
      "estimated_price": 500.0,
      "search_terms": "silver accent bracelet"
    }
  ],
  "styling_tips": []
}
"""
            if client and API_KEY:
                if GENAI_NEW_SDK:
                    response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=[prompt, img],
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    result = extract_json_from_response(response.text)
                else:
                    model = genai_legacy.GenerativeModel('gemini-1.5-flash')
                    response = model.generate_content([prompt, img])
                    result = extract_json_from_response(response.text)
        except Exception as e:
            print(f"Error analyzing jewelry outfit image: {e}")
    else:
        prompt = base_prompt + """
Format the output as JSON:
{
  "total_budget": 0.0,
  "jewelry_recommendations": [
    {
      "item_type": "bracelet",
      "name": "Sterling Silver Cuff Bracelet",
      "description": "Minimalist polished silver cuff.",
      "style": "Minimalist",
      "estimated_price": 500.0,
      "search_terms": "sterling silver cuff bracelet"
    }
  ],
  "styling_tips": []
}
"""
        if client and API_KEY:
            try:
                if GENAI_NEW_SDK:
                    response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt,
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    result = extract_json_from_response(response.text)
                else:
                    model = genai_legacy.GenerativeModel('gemini-1.5-flash')
                    response = model.generate_content(prompt)
                    result = extract_json_from_response(response.text)
            except Exception as e:
                print(f"Error calling Gemini for jewelry: {e}")

    # Fallback jewelry
    if not result or "jewelry_recommendations" not in result:
        b1 = round(total_budget * 0.25)
        b2 = round(total_budget * 0.35)
        b3 = round(total_budget * 0.30)
        result = {
            "total_budget": total_budget,
            "outfit_analysis": {
                "colors": ["#1e3a8a", "#f8fafc", "#64748b"],
                "style": "Contemporary Elegant",
                "formality": budget_input.occasion,
                "rationale": "Neutral tones and clean lines are complemented by minimalist silver and stone accents."
            },
            "jewelry_recommendations": [
                {
                    "item_type": "Bracelet",
                    "name": "925 Sterling Silver Link Bracelet",
                    "description": "A refined everyday piece with subtle shimmer.",
                    "style": "Minimalist",
                    "estimated_price": b1,
                    "search_terms": "925 silver link bracelet"
                },
                {
                    "item_type": "Ring",
                    "name": "Zirconia / Solitaire Band Ring",
                    "description": "Elegantly set band suitable for celebrations.",
                    "style": "Classic",
                    "estimated_price": b2,
                    "search_terms": "silver zirconia band ring"
                },
                {
                    "item_type": "Watch",
                    "name": "Minimalist Analog Leather Strap Watch",
                    "description": "Sophisticated timepiece tying together the entire look.",
                    "style": "Modern Executive",
                    "estimated_price": b3,
                    "search_terms": "classic leather strap analog watch"
                }
            ],
            "styling_tips": [
                "Balance metal finishes across the ring and bracelet.",
                "Let the watch serve as the key statement piece."
            ]
        }

    # Add Indian jewelry platforms links
    total_allocated = 0
    for item in result.get("jewelry_recommendations", []):
        search_terms = item.get("search_terms", item.get("name", ""))
        encoded_query = urllib.parse.quote_plus(search_terms)
        item["shopping_links"] = {
            "amazon": f"https://www.amazon.in/s?k={encoded_query}",
            "flipkart": f"https://www.flipkart.com/search?q={encoded_query}",
            "bluestone": f"https://www.bluestone.com/search.html?query={encoded_query}",
            "tanishq": f"https://www.tanishq.co.in/search?q={encoded_query}",
            "caratlane": f"https://www.caratlane.com/search?q={encoded_query}",
            "melorra": f"https://www.melorra.com/search?q={encoded_query}",
            "meesho": f"https://www.meesho.com/search?q={encoded_query}"
        }
        total_allocated += item.get("estimated_price", 0)

    result["remaining_budget"] = max(0.0, total_budget - total_allocated)
    return result
