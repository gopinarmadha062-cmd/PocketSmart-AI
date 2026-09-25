import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase limits for image payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-Memory Storage for Users, Sessions, and History
interface UserRecord {
  id: string;
  username: string;
  email: string;
  fullName: string;
  passwordHash: string;
  createdAt: string;
}

interface SessionRecord {
  username: string;
  loginTime: string;
  lastActivity: string;
  userData: Record<string, any>;
}

interface StoredRecommendation {
  id: string;
  username: string;
  timestamp: string;
  type: 'home' | 'party' | 'jewelry';
  input_summary: Record<string, any>;
  result_summary: {
    total_budget: number;
    remaining_budget: number;
    item_count: number;
    categories?: string[];
  };
  full_result: any;
}

const usersDb: Record<string, UserRecord> = {
  sai: {
    id: 'user_sai_101',
    username: 'sai',
    email: 'sai@example.com',
    fullName: 'Sai Kumar',
    passwordHash: 'password123',
    createdAt: new Date().toISOString(),
  },
};

const activeSessions: Record<string, SessionRecord> = {
  sai: {
    username: 'sai',
    loginTime: new Date(Date.now() - 3600000).toISOString(),
    lastActivity: new Date().toISOString(),
    userData: {
      last_home_budget: { budget: 50000, date: '2025-05-22' },
      last_party_budget: { budget: 35000, party_type: 'Birthday' },
      last_jewelry_budget: { budget: 45000, occasion: 'Wedding' },
    },
  },
};

const recommendationHistory: StoredRecommendation[] = [
  {
    id: 'rec_init_home_1',
    username: 'sai',
    timestamp: '2025-05-22T12:02:00.000Z',
    type: 'home',
    input_summary: {
      total_budget: 5000,
      rooms: ['Living Room', 'Kitchen'],
      lights: 5,
      fans: 4,
      furniture: 2,
    },
    result_summary: {
      total_budget: 5000,
      remaining_budget: 500,
      item_count: 4,
      categories: ['lighting', 'ceiling_fans', 'furniture'],
    },
    full_result: {
      id: 'rec_init_home_1',
      timestamp: '2025-05-22T12:02:00.000Z',
      total_budget: 5000,
      allocated_budget: 4500,
      remaining_budget: 500,
      budget_breakdown: [
        {
          category: 'Lighting',
          allocation: 1500,
          items: [
            {
              id: 'item_1',
              name: 'LED Bulb (Warm White)',
              description: 'Energy-efficient LED bulbs for ambient general living room and kitchen lighting.',
              estimated_price: 100,
              quantity: 5,
              search_terms: 'Warm White LED Bulbs B22 energy efficient',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=Warm+White+LED+Bulbs+B22+energy+efficient',
                flipkart: 'https://www.flipkart.com/search?q=Warm+White+LED+Bulbs+B22+energy+efficient',
                ikea: 'https://www.ikea.com/in/en/search/?q=Warm+White+LED+Bulbs',
                myntra: 'https://www.myntra.com/search?q=decorative+lights',
                ajio: 'https://www.ajio.com/search/?text=lights',
              },
            },
          ],
        },
        {
          category: 'Ceiling Fans',
          allocation: 2000,
          items: [
            {
              id: 'item_2',
              name: 'Havells / Crompton Ceiling Fan',
              description: 'Basic, functional high-airflow ceiling fan with rust-resistant powder coated finish.',
              estimated_price: 500,
              quantity: 4,
              search_terms: 'Havells Crompton high speed ceiling fan 1200mm',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=Havells+Crompton+high+speed+ceiling+fan+1200mm',
                flipkart: 'https://www.flipkart.com/search?q=Havells+Crompton+high+speed+ceiling+fan+1200mm',
                ikea: 'https://www.ikea.com/in/en/search/?q=ceiling+fan',
              },
            },
          ],
        },
        {
          category: 'Furniture',
          allocation: 1000,
          items: [
            {
              id: 'item_3',
              name: 'Plastic Ergonomic Chair Set',
              description: 'Stackable modern chairs for kitchen or study nook.',
              estimated_price: 250,
              quantity: 2,
              search_terms: 'stackable plastic chairs set of 2',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=stackable+plastic+chairs+set',
                flipkart: 'https://www.flipkart.com/search?q=stackable+plastic+chairs+set',
                ikea: 'https://www.ikea.com/in/en/search/?q=dining+chair',
              },
            },
            {
              id: 'item_4',
              name: 'Small Wooden Side Table',
              description: 'Simple minimalist engineered wood table for bedside or living area.',
              estimated_price: 500,
              quantity: 1,
              search_terms: 'small wooden side table living room',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=small+wooden+side+table',
                flipkart: 'https://www.flipkart.com/search?q=small+wooden+side+table',
                ikea: 'https://www.ikea.com/in/en/search/?q=side+table',
              },
            },
          ],
        },
      ],
      calculation_table: [
        { category: 'Lighting', items_count: 5, total_cost: 1500, percentage_of_budget: 30 },
        { category: 'Ceiling Fans', items_count: 4, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'Furniture', items_count: 3, total_cost: 1000, percentage_of_budget: 20 },
      ],
      additional_suggestions: [
        'Consider purchasing modular or used furniture pieces for further cost savings.',
        'Look out for festive sales and combo discounts on Indian marketplaces like Amazon & Flipkart.',
        'Prioritize core utility fixtures first and postpone secondary accent lighting.',
      ],
    },
  },
  {
    id: 'rec_init_party_2',
    username: 'sai',
    timestamp: '2025-05-22T12:05:00.000Z',
    type: 'party',
    input_summary: {
      total_budget: 5000,
      guests: 3,
      party_type: 'Wedding Anniversary',
      needs: 'Catering, Entertainment',
    },
    result_summary: {
      total_budget: 5000,
      remaining_budget: 0,
      item_count: 5,
      categories: ['Venue', 'Catering', 'Entertainment', 'Contingency'],
    },
    full_result: {
      id: 'rec_init_party_2',
      timestamp: '2025-05-22T12:05:00.000Z',
      total_budget: 5000,
      allocated_budget: 5000,
      remaining_budget: 0,
      budget_breakdown: [
        {
          category: 'Venue',
          allocation: 0,
          items: [
            {
              id: 'p_item_1',
              name: 'Cozy Home Celebration',
              description: 'Utilizing cozy home space as the celebration venue with warm ambient setup.',
              estimated_price: 0,
              quantity: 1,
              search_terms: 'home party setup and lighting',
              shopping_links: {
                google: 'https://www.google.com/search?q=home+party+decor',
                booking: 'https://www.booking.com/search.html?ss=Homestay',
                makemytrip: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText=homestay',
                oyorooms: 'https://www.oyorooms.com/search/?location=City',
                nobroker: 'https://www.nobroker.in/property/search/searchterm=banquet',
              },
            },
          ],
        },
        {
          category: 'Catering',
          allocation: 2000,
          items: [
            {
              id: 'p_item_2',
              name: 'Curated Multi-Course Meal',
              description: 'Gourmet meal or festive platter ordered from top rated local kitchen.',
              estimated_price: 2000,
              quantity: 1,
              search_terms: 'party food platter swiggy zomato',
              shopping_links: {
                swiggy: 'https://www.swiggy.com/search?query=party+platter',
                zomato: 'https://www.zomato.com/search?q=gourmet+meal',
                bigbasket: 'https://www.bigbasket.com/ps/?q=party+snacks',
              },
            },
          ],
        },
        {
          category: 'Entertainment',
          allocation: 2000,
          items: [
            {
              id: 'p_item_3',
              name: 'Streaming Movie / Music Playlist',
              description: 'HD streaming rental or celebration music playlist via Spotify / Prime.',
              estimated_price: 500,
              quantity: 1,
              search_terms: 'streaming service subscription',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=prime+video+gift+card',
                bookmyshow: 'https://in.bookmyshow.com/search?q=movie+stream',
              },
            },
            {
              id: 'p_item_4',
              name: 'Board Games / Trivia Cards',
              description: 'Fun interactive party game pack for friends & family.',
              estimated_price: 500,
              quantity: 1,
              search_terms: 'party board games for adults and family',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=party+board+games',
                flipkart: 'https://www.flipkart.com/search?q=party+board+games',
              },
            },
            {
              id: 'p_item_5',
              name: 'Keepsake Anniversary Token',
              description: 'A thoughtful token of appreciation or personalized gift.',
              estimated_price: 1000,
              quantity: 1,
              search_terms: 'custom anniversary gift hamper',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=anniversary+gift',
                flipkart: 'https://www.flipkart.com/search?q=anniversary+gift',
              },
            },
          ],
        },
        {
          category: 'Contingency',
          allocation: 1000,
          items: [
            {
              id: 'p_item_6',
              name: 'Unexpected Expenses & Tip Buffer',
              description: 'Reserve buffer for sudden ice, extra soft drinks, delivery tips.',
              estimated_price: 1000,
              quantity: 1,
              search_terms: 'party essentials buffer',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=party+disposables',
                flipkart: 'https://www.flipkart.com/search?q=party+supplies',
              },
            },
          ],
        },
      ],
      venue_suggestions: [
        {
          name: 'Intimate Rooftop or Home Lounge',
          type: 'Residential Lounge',
          capacity: 6,
          estimated_cost: 0,
          search_terms: 'cozy home celebration lounge',
          location: 'At Home or Private Terrace',
          shopping_links: {
            google: 'https://www.google.com/search?q=terrace+party+decor',
            oyorooms: 'https://www.oyorooms.com/search/?location=party+suite',
          },
        },
      ],
      calculation_table: [
        { category: 'Venue', items_count: 1, total_cost: 0, percentage_of_budget: 0 },
        { category: 'Catering', items_count: 1, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'Entertainment', items_count: 3, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'Contingency', items_count: 1, total_cost: 1000, percentage_of_budget: 20 },
      ],
      additional_suggestions: [
        'Organizing a potluck or BYOB for extended friend circles keeps food cost optimal.',
        'Utilize curated Spotify or YouTube music playlists connected to a smart speaker.',
        'Create simple DIY photo-booth props using fairy lights and printed Polaroid photos.',
      ],
    },
  },
  {
    id: 'rec_init_jewelry_3',
    username: 'sai',
    timestamp: '2025-05-22T12:06:00.000Z',
    type: 'jewelry',
    input_summary: {
      total_budget: 5000,
      occasion: 'Birthday Celebration',
      preferences: 'Minimalist, Sterling Silver or Leather',
      with_outfit_image: true,
    },
    result_summary: {
      total_budget: 5000,
      remaining_budget: 800,
      item_count: 3,
      categories: ['Bracelet', 'Ring', 'Watch'],
    },
    full_result: {
      id: 'rec_init_jewelry_3',
      timestamp: '2025-05-22T12:06:00.000Z',
      total_budget: 5000,
      allocated_budget: 4200,
      remaining_budget: 800,
      outfit_analysis: {
        colors: ['#1e3a8a', '#ffffff', '#cbd5e1'],
        style: 'Smart Casual / Semi-Formal',
        formality: 'Informal to Elevated Daytime',
        rationale: 'Complementing the blue shirt and clean tones with modern matte silver and braided leather accents.',
      },
      jewelry_recommendations: [
        {
          id: 'j_1',
          item_type: 'Bracelet',
          name: 'Braided Leather & Matte Steel Bracelet',
          description: 'A sleek braided leather bracelet with stainless steel magnetic clasp that adds subtle edge.',
          style: 'Casual Contemporary',
          estimated_price: 500,
          search_terms: 'mens braided leather bracelet magnetic clasp',
          shopping_links: {
            amazon: 'https://www.amazon.in/s?k=mens+braided+leather+bracelet',
            flipkart: 'https://www.flipkart.com/search?q=mens+braided+leather+bracelet',
            bluestone: 'https://www.bluestone.com/search.html?query=silver+bracelet',
            caratlane: 'https://www.caratlane.com/search?q=silver+bracelet',
            meesho: 'https://www.meesho.com/search?q=leather+bracelet',
          },
        },
        {
          id: 'j_2',
          item_type: 'Ring',
          name: 'Minimalist Brushed Tungsten / Silver Band',
          description: 'A clean silver or dark grey metal band with understated beveled edge. Minimalist elegance.',
          style: 'Minimalist Modern',
          estimated_price: 700,
          search_terms: 'brushed silver tungsten band ring',
          shopping_links: {
            amazon: 'https://www.amazon.in/s?k=brushed+silver+band+ring',
            flipkart: 'https://www.flipkart.com/search?q=brushed+silver+band+ring',
            tanishq: 'https://www.tanishq.co.in/search?q=silver+ring',
            caratlane: 'https://www.caratlane.com/search?q=band+ring',
            melorra: 'https://www.melorra.com/search?q=silver+ring',
          },
        },
        {
          id: 'j_3',
          item_type: 'Watch',
          name: 'Classic Chrono Leather Strap Watch',
          description: 'A timeless timepiece with deep navy or clean white dial and contrast stitched strap.',
          style: 'Classic Executive',
          estimated_price: 3000,
          search_terms: 'classic analog watch leather strap blue dial',
          shopping_links: {
            amazon: 'https://www.amazon.in/s?k=classic+analog+watch+leather+strap',
            flipkart: 'https://www.flipkart.com/search?q=classic+analog+watch+leather+strap',
            caratlane: 'https://www.caratlane.com/search?q=watch',
            meesho: 'https://www.meesho.com/search?q=analog+watch',
          },
        },
      ],
      styling_tips: [
        'Keep accessories minimal to harmonize with the relaxed casual neckline of the shirt.',
        'Consider the watch as the anchor statement piece, coordinating ring metal tones with the buckle.',
        'Ensure the leather tones of the bracelet pair naturally with belt or shoe choices.',
      ],
    },
  },
];

// Helper to generate shopping links across registered platforms
function buildPlatformLinks(searchQuery: string, platforms: string[]): Record<string, string> {
  const enc = encodeURIComponent(searchQuery);
  const links: Record<string, string> = {};
  for (const p of platforms) {
    switch (p.toLowerCase()) {
      case 'amazon':
        links['amazon'] = `https://www.amazon.in/s?k=${enc}`;
        break;
      case 'flipkart':
        links['flipkart'] = `https://www.flipkart.com/search?q=${enc}`;
        break;
      case 'ikea':
        links['ikea'] = `https://www.ikea.com/in/en/search/?q=${enc}`;
        break;
      case 'myntra':
        links['myntra'] = `https://www.myntra.com/search?q=${enc}`;
        break;
      case 'ajio':
        links['ajio'] = `https://www.ajio.com/search/?text=${enc}`;
        break;
      case 'swiggy':
        links['swiggy'] = `https://www.swiggy.com/search?query=${enc}`;
        break;
      case 'zomato':
        links['zomato'] = `https://www.zomato.com/search?q=${enc}`;
        break;
      case 'bigbasket':
        links['bigbasket'] = `https://www.bigbasket.com/ps/?q=${enc}`;
        break;
      case 'oyorooms':
      case 'oyo':
        links['oyorooms'] = `https://www.oyorooms.com/search/?location=${enc}`;
        break;
      case 'makemytrip':
        links['makemytrip'] = `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${enc}`;
        break;
      case 'booking':
        links['booking'] = `https://www.booking.com/search.html?ss=${enc}`;
        break;
      case 'nobroker':
        links['nobroker'] = `https://www.nobroker.in/property/search/searchterm=${enc}`;
        break;
      case 'bookmyshow':
        links['bookmyshow'] = `https://in.bookmyshow.com/search?q=${enc}`;
        break;
      case 'bluestone':
        links['bluestone'] = `https://www.bluestone.com/search.html?query=${enc}`;
        break;
      case 'tanishq':
        links['tanishq'] = `https://www.tanishq.co.in/search?q=${enc}`;
        break;
      case 'caratlane':
        links['caratlane'] = `https://www.caratlane.com/search?q=${enc}`;
        break;
      case 'melorra':
        links['melorra'] = `https://www.melorra.com/search?q=${enc}`;
        break;
      case 'meesho':
        links['meesho'] = `https://www.meesho.com/search?q=${enc}`;
        break;
      case 'google':
        links['google'] = `https://www.google.com/search?q=${enc}`;
        break;
    }
  }
  return links;
}

// -------------------------------------------------------------
// AUTHENTICATION & SESSION ROUTES
// -------------------------------------------------------------

app.post(['/api/register', '/register'], (req: Request, res: Response) => {
  const { username, email, fullName, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ detail: 'Username, email and password are required' });
  }

  const cleanUser = username.trim().toLowerCase();
  if (usersDb[cleanUser]) {
    return res.status(400).json({ detail: 'Username already registered' });
  }

  const newUser: UserRecord = {
    id: `user_${Date.now()}`,
    username: cleanUser,
    email: email.trim(),
    fullName: (fullName || cleanUser).trim(),
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };

  usersDb[cleanUser] = newUser;
  activeSessions[cleanUser] = {
    username: cleanUser,
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    userData: {},
  };

  return res.status(201).json({
    message: 'User registered successfully',
    access_token: `token_${cleanUser}_${Date.now()}`,
    token_type: 'bearer',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
    },
  });
});

app.post(['/api/login', '/login', '/api/token', '/token'], (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ detail: 'Username and password are required' });
  }

  const cleanUser = username.trim().toLowerCase();
  const user = usersDb[cleanUser];

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ detail: 'Incorrect username or password' });
  }

  activeSessions[cleanUser] = {
    username: cleanUser,
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    userData: activeSessions[cleanUser]?.userData || {},
  };

  return res.json({
    access_token: `token_${cleanUser}_${Date.now()}`,
    token_type: 'bearer',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
});

app.post(['/api/logout', '/logout'], (req: Request, res: Response) => {
  const { username } = req.body;
  if (username && activeSessions[username.toLowerCase()]) {
    delete activeSessions[username.toLowerCase()];
  }
  return res.json({ message: 'Logged out successfully' });
});

app.get(['/api/session-info', '/session-info'], (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const usernameHeader = (req.query.username as string) || 'sai';
  const session = activeSessions[usernameHeader.toLowerCase()];

  if (!session) {
    return res.status(404).json({ detail: 'No active session found' });
  }

  const durationMinutes = Math.floor(
    (Date.now() - new Date(session.loginTime).getTime()) / 60000
  );

  return res.json({
    username: session.username,
    login_time: session.loginTime,
    last_activity: session.lastActivity,
    session_duration_minutes: durationMinutes,
    user_data: session.userData,
  });
});

app.post(['/api/session-data', '/session-data'], (req: Request, res: Response) => {
  const { username, data } = req.body;
  const targetUser = (username || 'sai').toLowerCase();
  if (!activeSessions[targetUser]) {
    activeSessions[targetUser] = {
      username: targetUser,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      userData: {},
    };
  }

  Object.assign(activeSessions[targetUser].userData, data);
  activeSessions[targetUser].lastActivity = new Date().toISOString();

  return res.json({
    message: 'Session data updated',
    data: activeSessions[targetUser].userData,
  });
});

// -------------------------------------------------------------
// SCENARIO 1: HOME INTERIOR BUDGET PLANNER ROUTE
// -------------------------------------------------------------

app.post(['/api/generate-home', '/generate-home', '/home-budget', '/api/home-budget'], async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      num_lights = 5,
      num_fans = 4,
      num_furniture = 2,
      num_dining_tables = 1,
      rooms = {},
      additional_requirements = '',
      username = 'sai',
    } = req.body;

    const budgetNum = Number(total_budget) || 5000;
    const roomsList = Object.entries(rooms)
      .filter(([_, val]) => Boolean(val))
      .map(([roomKey]) => roomKey.replace('_', ' '));
    const roomsString = roomsList.length > 0 ? roomsList.join(', ') : 'Living Room, Kitchen, Bedroom';

    // Construct prompt for Gemini
    const prompt = `
You are PocketSmart AI, an expert Indian home interior budget planner.
Generate a realistic, cost-effective interior design and product recommendation plan for a home in India.

User Request Parameters:
- Total Budget: ₹${budgetNum.toFixed(2)} INR
- Requirements:
  * Lights/lighting fixtures: ${num_lights}
  * Ceiling fans: ${num_fans}
  * Furniture pieces: ${num_furniture}
  * Dining tables: ${num_dining_tables}
  * Rooms to consider: ${roomsString}
  * Additional requirements: ${additional_requirements || 'Functional, stylish, durable and cost-effective'}

Rules:
1. All estimated prices must be in INR (₹) and must realistically fit within ₹${budgetNum.toFixed(2)}.
2. Allocate budget across logical categories: "Lighting", "Ceiling Fans", "Furniture", "Dining" (if requested), and optional "Decor & Accents".
3. Provide realistic product names common on Indian e-commerce (e.g. Havells, Crompton, Philips, Wipro, Solimo, IKEA, Wakefit, Nilkamal, Pepperfry).
4. Provide concise, descriptive search terms suitable for Indian shopping platforms like Amazon India, Flipkart, and IKEA.
5. The sum of all item prices * quantities MUST NOT exceed the total budget of ₹${budgetNum.toFixed(2)}. Keep a modest buffer for remaining budget.
6. Provide practical Indian money-saving suggestions in "additional_suggestions".

Respond STRICTLY in JSON format following this exact structure:
{
  "total_budget": ${budgetNum},
  "budget_breakdown": [
    {
      "category": "Lighting",
      "allocation": 1200,
      "items": [
        {
          "name": "Philips LED Bulb 9W Pack of 4",
          "description": "Energy-efficient warm white B22 bulbs for ambient living room lighting.",
          "estimated_price": 400,
          "quantity": 1,
          "search_terms": "Philips 9W warm white LED bulbs pack"
        }
      ]
    }
  ],
  "additional_suggestions": [
    "Tip 1...",
    "Tip 2..."
  ]
}
`;

    let generatedJson: any = null;

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        generatedJson = JSON.parse(rawText);
      } catch (genError) {
        console.error('Gemini API call failed, falling back to smart calculation engine:', genError);
      }
    }

    // Fallback or validation engine
    if (!generatedJson || !generatedJson.budget_breakdown) {
      const lightingAlloc = Math.round(budgetNum * 0.28);
      const fanAlloc = Math.round(budgetNum * 0.35);
      const furnAlloc = Math.round(budgetNum * 0.25);
      const remainingCalc = budgetNum - (lightingAlloc + fanAlloc + furnAlloc);

      generatedJson = {
        total_budget: budgetNum,
        budget_breakdown: [
          {
            category: 'Lighting',
            allocation: lightingAlloc,
            items: [
              {
                name: 'LED Bulbs & Accent Downlights Set',
                description: `Pack of energy-efficient LED fixtures designed for ${roomsString}.`,
                estimated_price: Math.round(lightingAlloc / Math.max(num_lights, 1)),
                quantity: num_lights || 3,
                search_terms: 'warm white energy efficient LED bulb fixtures pack',
              },
            ],
          },
          {
            category: 'Ceiling Fans',
            allocation: fanAlloc,
            items: [
              {
                name: 'Crompton / Havells High-Speed Fan',
                description: 'Reliable 1200mm sweep aerodynamic ceiling fan with copper motor.',
                estimated_price: Math.round(fanAlloc / Math.max(num_fans, 1)),
                quantity: num_fans || 2,
                search_terms: 'Crompton 1200mm high speed ceiling fan copper motor',
              },
            ],
          },
          {
            category: 'Furniture & Tables',
            allocation: furnAlloc,
            items: [
              {
                name: 'Engineered Wood Coffee / Dining Table',
                description: 'Compact space-saving wood finish utility table.',
                estimated_price: Math.round(furnAlloc * 0.6),
                quantity: num_dining_tables || 1,
                search_terms: 'engineered wood compact dining coffee table living room',
              },
              {
                name: 'Ergonomic Cushion Utility Chairs',
                description: 'Pair of durable aesthetic chairs matching room accents.',
                estimated_price: Math.round((furnAlloc * 0.4) / Math.max(num_furniture, 1)),
                quantity: num_furniture || 2,
                search_terms: 'modern cushioned accent dining chairs set',
              },
            ],
          },
        ],
        additional_suggestions: [
          'Take advantage of IKEA click-and-collect or Amazon Prime day promotions for free delivery.',
          'Consider multi-functional furniture with built-in storage to maximize living space.',
          'Use warm white (2700K-3000K) bulbs in living and bedrooms to create a welcoming ambiance.',
        ],
      };
    }

    // Enrich items with shopping links across Indian platforms
    let totalAllocated = 0;
    const calculationTable: any[] = [];

    const homePlatforms = ['amazon', 'flipkart', 'ikea', 'myntra', 'ajio'];

    for (const cat of generatedJson.budget_breakdown) {
      let catTotal = 0;
      let catCount = 0;

      for (let i = 0; i < cat.items.length; i++) {
        const item = cat.items[i];
        item.id = `item_${cat.category.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`;
        const query = item.search_terms || `${item.name} ${cat.category}`;
        item.shopping_links = buildPlatformLinks(query, homePlatforms);
        const itemTotal = (item.estimated_price || 0) * (item.quantity || 1);
        catTotal += itemTotal;
        catCount += item.quantity || 1;
      }

      totalAllocated += catTotal;
      calculationTable.push({
        category: cat.category,
        items_count: catCount,
        total_cost: catTotal,
        percentage_of_budget: budgetNum > 0 ? Number(((catTotal / budgetNum) * 100).toFixed(1)) : 0,
      });
    }

    const remainingBudget = Math.max(0, budgetNum - totalAllocated);

    const result = {
      id: `rec_home_${Date.now()}`,
      timestamp: new Date().toISOString(),
      total_budget: budgetNum,
      allocated_budget: totalAllocated,
      remaining_budget: remainingBudget,
      budget_breakdown: generatedJson.budget_breakdown,
      calculation_table: calculationTable,
      additional_suggestions: generatedJson.additional_suggestions || [
        'Consider refurbished or second-hand timber furniture for higher vintage durability.',
        'Use LED strip backlighting behind mirrors or headboards for luxurious look under ₹1,000.',
      ],
    };

    // Save to user session data and global history
    const userKey = (username || 'sai').toLowerCase();
    if (activeSessions[userKey]) {
      activeSessions[userKey].userData.last_home_budget = {
        timestamp: result.timestamp,
        budget: budgetNum,
        requirements: {
          lights: num_lights,
          fans: num_fans,
          furniture: num_furniture,
          dining_tables: num_dining_tables,
          rooms: roomsList,
        },
      };
    }

    recommendationHistory.unshift({
      id: result.id,
      username: userKey,
      timestamp: result.timestamp,
      type: 'home',
      input_summary: {
        total_budget: budgetNum,
        rooms: roomsList,
        lights: num_lights,
        fans: num_fans,
        furniture: num_furniture,
      },
      result_summary: {
        total_budget: budgetNum,
        remaining_budget: remainingBudget,
        item_count: calculationTable.reduce((acc, row) => acc + row.items_count, 0),
        categories: generatedJson.budget_breakdown.map((c: any) => c.category),
      },
      full_result: result,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error generating home recommendations:', error);
    return res.status(500).json({ detail: `Error generating recommendations: ${error.message}` });
  }
});

// -------------------------------------------------------------
// SCENARIO 2: PARTY BUDGET PLANNER ROUTE
// -------------------------------------------------------------

app.post(['/api/generate-party', '/generate-party', '/party-budget', '/api/party-budget'], async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      num_guests = 4,
      party_type = 'Birthday',
      venue_type = 'Home',
      needs_catering = true,
      needs_decoration = true,
      needs_entertainment = true,
      needs_photography = false,
      additional_requirements = '',
      username = 'sai',
    } = req.body;

    const budgetNum = Number(total_budget) || 5000;

    const prompt = `
You are PocketSmart AI, an expert event planner for Indian celebrations (parties, birthdays, anniversaries, weddings, get-togethers).
Generate a complete, personalized party planning and budget allocation plan in India.

Parameters:
- Total Budget: ₹${budgetNum.toFixed(2)} INR
- Event Type: ${party_type}
- Guest Count: ${num_guests} guests
- Venue Type: ${venue_type || 'Home / Intimate space'}
- Needs:
  * Catering/Food: ${needs_catering ? 'Yes' : 'No'}
  * Decoration: ${needs_decoration ? 'Yes' : 'No'}
  * Entertainment/Music/Games: ${needs_entertainment ? 'Yes' : 'No'}
  * Photography: ${needs_photography ? 'Yes' : 'No'}
- Additional Requirements: ${additional_requirements || 'Fun, memorable, smooth experience with delicious food'}

Rules:
1. Prices in INR (₹). Total of all items MUST NOT exceed ₹${budgetNum.toFixed(2)}.
2. Allocate proportionally across relevant categories: "Venue", "Catering", "Entertainment", "Decoration", "Contingency / Buffer".
3. For catering, provide realistic meal options available via Swiggy, Zomato, or BigBasket.
4. For venue, if Home was selected, venue cost is 0. If banquet/resort, give realistic pricing.
5. In "venue_suggestions", provide 1-2 venue concepts with capacity and cost.
6. Provide search terms suitable for Indian apps like Swiggy, Zomato, BookMyShow, MakeMyTrip, OYO, Amazon India, and Meesho.

Output strictly valid JSON:
{
  "total_budget": ${budgetNum},
  "budget_breakdown": [
    {
      "category": "Catering",
      "allocation": 2000,
      "items": [
        {
          "name": "Party Snack Box & Gourmet Meal Combo",
          "description": "Assorted appetizers, main course, and beverage for guests.",
          "estimated_price": 2000,
          "quantity": 1,
          "search_terms": "party combo platter meals catering"
        }
      ]
    }
  ],
  "venue_suggestions": [
    {
      "name": "Cozy Home Living Room Setup",
      "type": "Residential",
      "capacity": ${num_guests + 2},
      "estimated_cost": 0,
      "search_terms": "home celebration venue setup",
      "location": "Host Residence"
    }
  ],
  "additional_suggestions": [
    "Tip 1...",
    "Tip 2..."
  ]
}
`;

    let generatedJson: any = null;

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const rawText = response.text || '';
        generatedJson = JSON.parse(rawText);
      } catch (err) {
        console.error('Gemini error for party planner:', err);
      }
    }

    if (!generatedJson || !generatedJson.budget_breakdown) {
      // Dynamic calculation fallback
      const cateringAlloc = needs_catering ? Math.round(budgetNum * 0.4) : 0;
      const decorAlloc = needs_decoration ? Math.round(budgetNum * 0.2) : 0;
      const entAlloc = needs_entertainment ? Math.round(budgetNum * 0.2) : 0;
      const contingencyAlloc = Math.max(200, Math.round(budgetNum * 0.1));
      const venueAlloc = venue_type && venue_type.toLowerCase() !== 'home' ? Math.round(budgetNum * 0.1) : 0;

      generatedJson = {
        total_budget: budgetNum,
        budget_breakdown: [
          {
            category: 'Venue',
            allocation: venueAlloc,
            items: [
              {
                name: venue_type === 'Home' ? 'Cozy Home Celebration Space' : `${venue_type} Party Booking`,
                description: `Selected venue space setup suited for ${num_guests} guests.`,
                estimated_price: venueAlloc,
                quantity: 1,
                search_terms: `${venue_type} party booking or homestay`,
              },
            ],
          },
          ...(needs_catering
            ? [
                {
                  category: 'Catering',
                  allocation: cateringAlloc,
                  items: [
                    {
                      name: 'Party Feast & Refreshment Platter',
                      description: `Curated hot meal, appetizers and celebration beverages for ${num_guests} guests.`,
                      estimated_price: cateringAlloc,
                      quantity: 1,
                      search_terms: 'party food platter catering swiggy zomato',
                    },
                  ],
                },
              ]
            : []),
          ...(needs_decoration
            ? [
                {
                  category: 'Decoration',
                  allocation: decorAlloc,
                  items: [
                    {
                      name: 'Themed Balloon Arch & Banner Kit',
                      description: `Color-coordinated celebration banner, foil balloons, and LED string lights.`,
                      estimated_price: decorAlloc,
                      quantity: 1,
                      search_terms: `${party_type} theme decoration banner balloon kit`,
                    },
                  ],
                },
              ]
            : []),
          ...(needs_entertainment
            ? [
                {
                  category: 'Entertainment',
                  allocation: entAlloc,
                  items: [
                    {
                      name: 'Interactive Party Games & Music Subscription',
                      description: 'Popular card / board games and playlist subscription for non-stop vibe.',
                      estimated_price: entAlloc,
                      quantity: 1,
                      search_terms: 'party games board games cards spotify prime',
                    },
                  ],
                },
              ]
            : []),
          {
            category: 'Contingency',
            allocation: contingencyAlloc,
            items: [
              {
                name: 'Emergency Buffer & Instant Delivery Items',
                description: 'Buffer for last minute extra ice, cutlery, water bottles, and tips.',
                estimated_price: contingencyAlloc,
                quantity: 1,
                search_terms: 'party disposables glasses napkins ice',
              },
            ],
          },
        ],
        venue_suggestions: [
          {
            name: venue_type === 'Home' ? 'Host Residence' : 'Private Celebration Lounge',
            type: venue_type || 'Residential',
            capacity: num_guests + 4,
            estimated_cost: venueAlloc,
            search_terms: `${venue_type} party space`,
            location: 'Local / City Center',
          },
        ],
        additional_suggestions: [
          'Pre-order food platters at least 3 hours in advance on Swiggy or Zomato to prevent evening rush delays.',
          'Create a collaborative Spotify playlist where guests can queue their favorite party tracks.',
          'Use reusable fabric bunting or fairy lights that can be repurposed for future festivals.',
        ],
      };
    }

    // Enrich party items with shopping/booking links
    let totalAllocated = 0;
    const calculationTable: any[] = [];

    const getPlatformsForCat = (catName: string): string[] => {
      const c = catName.toLowerCase();
      if (c.includes('venue')) return ['google', 'booking', 'makemytrip', 'oyorooms', 'nobroker'];
      if (c.includes('cater') || c.includes('food') || c.includes('drink')) return ['swiggy', 'zomato', 'bigbasket', 'amazon', 'flipkart'];
      if (c.includes('decor')) return ['amazon', 'flipkart', 'meesho', 'myntra'];
      if (c.includes('entertainment') || c.includes('music')) return ['bookmyshow', 'amazon', 'flipkart'];
      if (c.includes('gift') || c.includes('accessor')) return ['amazon', 'flipkart', 'myntra', 'meesho'];
      return ['amazon', 'flipkart', 'google'];
    };

    for (const cat of generatedJson.budget_breakdown) {
      let catTotal = 0;
      let catCount = 0;
      const platforms = getPlatformsForCat(cat.category);

      for (let i = 0; i < cat.items.length; i++) {
        const item = cat.items[i];
        item.id = `party_item_${cat.category.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`;
        const query = item.search_terms || `${item.name} ${party_type}`;
        item.shopping_links = buildPlatformLinks(query, platforms);
        const itemTotal = (item.estimated_price || 0) * (item.quantity || 1);
        catTotal += itemTotal;
        catCount += item.quantity || 1;
      }

      totalAllocated += catTotal;
      calculationTable.push({
        category: cat.category,
        items_count: catCount,
        total_cost: catTotal,
        percentage_of_budget: budgetNum > 0 ? Number(((catTotal / budgetNum) * 100).toFixed(1)) : 0,
      });
    }

    // Enrich venue suggestions with booking links
    if (generatedJson.venue_suggestions) {
      for (const v of generatedJson.venue_suggestions) {
        v.shopping_links = buildPlatformLinks(v.search_terms || v.name, ['google', 'booking', 'makemytrip', 'oyorooms', 'nobroker']);
      }
    }

    const remainingBudget = Math.max(0, budgetNum - totalAllocated);

    const result = {
      id: `rec_party_${Date.now()}`,
      timestamp: new Date().toISOString(),
      total_budget: budgetNum,
      allocated_budget: totalAllocated,
      remaining_budget: remainingBudget,
      budget_breakdown: generatedJson.budget_breakdown,
      venue_suggestions: generatedJson.venue_suggestions || [],
      calculation_table: calculationTable,
      additional_suggestions: generatedJson.additional_suggestions || [],
    };

    const userKey = (username || 'sai').toLowerCase();
    if (activeSessions[userKey]) {
      activeSessions[userKey].userData.last_party_budget = {
        timestamp: result.timestamp,
        budget: budgetNum,
        party_type,
        guests: num_guests,
      };
    }

    recommendationHistory.unshift({
      id: result.id,
      username: userKey,
      timestamp: result.timestamp,
      type: 'party',
      input_summary: {
        total_budget: budgetNum,
        party_type,
        guests: num_guests,
        needs: [
          needs_catering && 'Catering',
          needs_decoration && 'Decoration',
          needs_entertainment && 'Entertainment',
        ].filter(Boolean).join(', '),
      },
      result_summary: {
        total_budget: budgetNum,
        remaining_budget: remainingBudget,
        item_count: calculationTable.reduce((acc, row) => acc + row.items_count, 0),
        categories: generatedJson.budget_breakdown.map((c: any) => c.category),
      },
      full_result: result,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error generating party recommendations:', error);
    return res.status(500).json({ detail: `Error generating party budget: ${error.message}` });
  }
});

// -------------------------------------------------------------
// SCENARIO 3: JEWELRY BUDGET PLANNER ROUTE (MULTIMODAL)
// -------------------------------------------------------------

app.post(['/api/generate-jewelry', '/generate-jewelry', '/jewelry-budget', '/api/jewelry-budget'], async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      occasion = 'Birthday',
      preferences = 'Minimalist',
      image = null, // base64 or data URL
      image_name = null,
      username = 'sai',
    } = req.body;

    const budgetNum = Number(total_budget) || 5000;

    let basePrompt = `
You are PocketSmart AI, a premier jewelry stylist and budget recommendation expert in India.
Analyze user parameters, budget, occasion, style preferences, and any provided outfit image to suggest a cohesive jewelry collection from popular Indian platforms (Amazon India, Flipkart, BlueStone, Tanishq, CaratLane, Melorra, Meesho).

Parameters:
- Total Budget: ₹${budgetNum.toFixed(2)} INR
- Occasion: ${occasion}
- Preferences: ${preferences || 'Not specified'}

Guidelines:
1. Provide elegant, complementary pieces (such as Necklace, Earrings, Bracelet, Ring, Watch, or Maang Tikka).
2. Prices must be in INR (₹). Total cost must NOT exceed ₹${budgetNum.toFixed(2)}.
3. Match the Indian shopping market with appropriate brands (Tanishq, CaratLane, BlueStone, Melorra, Amazon Fashion, Meesho, Voylla, GIVA).
4. Provide search terms suitable for Indian jewelry portals.
5. Provide actionable professional styling tips.
`;

    if (image) {
      basePrompt += `
6. An image of the user's outfit has been provided. Perform visual outfit analysis:
   - Identify dominant colors.
   - Detect overall outfit style (casual, ethnic, western formal, cocktail, etc.).
   - Detect formality level.
   - Tailor jewelry recommendations to seamlessly complement neckline, color contrast, and metal warmth.
`;
    }

    basePrompt += `
Format your response STRICTLY as JSON with this structure:
{
  "total_budget": ${budgetNum},
  "outfit_analysis": {
    "colors": ["#1e3a8a", "#ffffff"],
    "style": "Casual Chic",
    "formality": "Semi-formal",
    "rationale": "Explanation of how jewelry accents complement this outfit..."
  },
  "jewelry_recommendations": [
    {
      "item_type": "Bracelet",
      "name": "Braided Silver / Leather Accent Bracelet",
      "description": "A refined understated bracelet adding subtle charm.",
      "style": "Modern Minimalist",
      "estimated_price": 500,
      "search_terms": "silver braided minimalist bracelet"
    }
  ],
  "styling_tips": [
    "Tip 1...",
    "Tip 2..."
  ]
}
`;

    let generatedJson: any = null;

    if (apiKey) {
      try {
        let contentsPayload: any = basePrompt;

        if (image && typeof image === 'string') {
          // Parse data URL: e.g. "data:image/png;base64,iVBORw..."
          const match = image.match(/^data:([^;]+);base64,(.+)$/);
          let mimeType = 'image/jpeg';
          let base64Data = image;

          if (match) {
            mimeType = match[1];
            base64Data = match[2];
          }

          contentsPayload = {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: basePrompt,
              },
            ],
          };
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsPayload,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        generatedJson = JSON.parse(rawText);
      } catch (err) {
        console.error('Gemini error for jewelry planner:', err);
      }
    }

    if (!generatedJson || !generatedJson.jewelry_recommendations) {
      const piece1Alloc = Math.round(budgetNum * 0.15);
      const piece2Alloc = Math.round(budgetNum * 0.2);
      const piece3Alloc = Math.round(budgetNum * 0.5);

      generatedJson = {
        total_budget: budgetNum,
        outfit_analysis: image
          ? {
              colors: ['#2563eb', '#f8fafc', '#475569'],
              style: `${preferences || 'Modern'} / Semi-Formal`,
              formality: occasion,
              rationale: `The jewelry recommendations are calibrated to accentuate the colors and silhouette for a ${occasion} event.`,
            }
          : undefined,
        jewelry_recommendations: [
          {
            item_type: 'Bracelet',
            name: 'Delicate Sterling Silver / Braided Cuff',
            description: `Understated wrist accessory tailored for a ${occasion}.`,
            style: preferences || 'Minimalist',
            estimated_price: piece1Alloc,
            search_terms: `${preferences} silver bracelet cuff for ${occasion}`,
          },
          {
            item_type: 'Ring',
            name: 'Solitaire or Matte Finished Silver Band',
            description: 'Minimalist statement band with subtle luster that catches the light.',
            style: 'Contemporary Classic',
            estimated_price: piece2Alloc,
            search_terms: 'sterling silver minimalist band ring',
          },
          {
            item_type: 'Neckpiece / Watch',
            name: 'Pendant Necklace or Classic Analog Timepiece',
            description: 'The centerpiece accessory providing focal elegance.',
            style: 'Refined Elegance',
            estimated_price: piece3Alloc,
            search_terms: `elegant pendant necklace watch for ${occasion}`,
          },
        ],
        styling_tips: [
          'Choose one focal statement piece (e.g. bold watch or pendant) and keep secondary accessories subtle.',
          'Ensure metal finishes (silver vs gold vs rose gold) match consistently across buckle, ring, and necklace.',
          'Consider versatile 925 sterling silver from brands like GIVA, CaratLane, or BlueStone for long-lasting sheen.',
        ],
      };
    }

    // Enrich jewelry recommendations with Indian jewelry shopping platforms
    const jewelryPlatforms = ['amazon', 'flipkart', 'bluestone', 'tanishq', 'caratlane', 'melorra', 'meesho'];
    let totalAllocated = 0;

    for (let i = 0; i < generatedJson.jewelry_recommendations.length; i++) {
      const item = generatedJson.jewelry_recommendations[i];
      item.id = `jewelry_item_${i + 1}`;
      const query = item.search_terms || `${item.name} ${item.item_type}`;
      item.shopping_links = buildPlatformLinks(query, jewelryPlatforms);
      totalAllocated += (item.estimated_price || 0) * (item.quantity || 1);
    }

    const remainingBudget = Math.max(0, budgetNum - totalAllocated);

    const calculationTable: any[] = generatedJson.jewelry_recommendations.map((item: any) => ({
      category: item.item_type || 'Jewelry Piece',
      items_count: item.quantity || 1,
      total_cost: (item.estimated_price || 0) * (item.quantity || 1),
      percentage_of_budget: budgetNum > 0 ? Number((((item.estimated_price || 0) / budgetNum) * 100).toFixed(1)) : 0,
    }));

    const result = {
      id: `rec_jewelry_${Date.now()}`,
      timestamp: new Date().toISOString(),
      total_budget: budgetNum,
      allocated_budget: totalAllocated,
      remaining_budget: remainingBudget,
      outfit_analysis: generatedJson.outfit_analysis,
      jewelry_recommendations: generatedJson.jewelry_recommendations,
      styling_tips: generatedJson.styling_tips || [],
      calculation_table: calculationTable,
    };

    const userKey = (username || 'sai').toLowerCase();
    if (activeSessions[userKey]) {
      activeSessions[userKey].userData.last_jewelry_budget = {
        timestamp: result.timestamp,
        budget: budgetNum,
        occasion,
        has_image: Boolean(image),
      };
    }

    recommendationHistory.unshift({
      id: result.id,
      username: userKey,
      timestamp: result.timestamp,
      type: 'jewelry',
      input_summary: {
        total_budget: budgetNum,
        occasion,
        preferences,
        with_outfit_image: Boolean(image),
      },
      result_summary: {
        total_budget: budgetNum,
        remaining_budget: remainingBudget,
        item_count: generatedJson.jewelry_recommendations.length,
        categories: generatedJson.jewelry_recommendations.map((j: any) => j.item_type),
      },
      full_result: result,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error generating jewelry recommendations:', error);
    return res.status(500).json({ detail: `Error generating jewelry recommendations: ${error.message}` });
  }
});

// -------------------------------------------------------------
// HISTORY & DETAILS ROUTES
// -------------------------------------------------------------

app.get(['/api/history', '/recommendation-history'], (req: Request, res: Response) => {
  const username = ((req.query.username as string) || 'sai').toLowerCase();
  const userRecs = recommendationHistory.filter(
    (item) => !username || item.username === username || item.username === 'sai'
  );

  return res.json({
    history: userRecs.map((r) => ({
      id: r.id,
      username: r.username,
      timestamp: r.timestamp,
      type: r.type,
      input: r.input_summary,
      input_summary: r.input_summary,
      summary: r.result_summary,
      result_summary: r.result_summary,
      full_result: r.full_result,
    })),
  });
});

app.get(['/api/recommendation-details/:id', '/recommendations-details/:id'], (req: Request, res: Response) => {
  const recId = req.params.id;
  const found = recommendationHistory.find((r) => r.id === recId);
  if (!found) {
    return res.status(404).json({ detail: 'Recommendation not found' });
  }
  return res.json({
    id: found.id,
    timestamp: found.timestamp,
    type: found.type,
    input: found.input_summary,
    full_result: found.full_result,
  });
});

app.delete('/api/history/:id', (req: Request, res: Response) => {
  const recId = req.params.id;
  const idx = recommendationHistory.findIndex((r) => r.id === recId);
  if (idx !== -1) {
    recommendationHistory.splice(idx, 1);
    return res.json({ message: 'Deleted successfully' });
  }
  return res.status(404).json({ detail: 'Recommendation not found' });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS HOSTING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start PocketSmart AI server:', err);
});
