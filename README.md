# PocketSmart AI: Your Smart Budget & Recommendation Assistant

**PocketSmart AI** is a GenAI-powered, cross-platform recommendation and budgeting system that delivers personalized, budget-conscious recommendations for home decor, event planning, and jewelry purchases across popular platforms such as **Amazon, Flipkart, IKEA, Swiggy, Zomato, OYO, MakeMyTrip, Tanishq, CaratLane, BlueStone, and Meesho**.

---

## 🌟 Core Scenarios & Modules

1. **Scenario 1: Home Interior Planning with Smart Budget Allocation**
   - Allocates budgets dynamically across lighting fixtures, ceiling fans, furniture pieces, and dining tables.
   - Tailors item recommendations for living rooms, kitchens, bedrooms, and balconies.
   - Real-time links directly to Amazon India, Flipkart, and IKEA.
   - Dynamic INR calculation table with category counts and percentage allocations.

2. **Scenario 2: AI-Based Party Budget Planning**
   - Allocates budgets for birthdays, weddings, anniversaries, corporate, or dinner events.
   - Breakdown across venue, catering, decoration, entertainment, and unexpected expense contingency.
   - Sourcing suggestions from Swiggy, Zomato, BigBasket, BookMyShow, MakeMyTrip, and OYO.
   - Venue suggestions with guest capacity and direct booking options.

3. **Scenario 3: Jewelry Recommendations for Occasions (Multimodal Vision)**
   - Tailors accessories to specific occasions (Wedding, Birthday, Festive / Diwali, Cocktail, Formal).
   - Accepts text prompts plus optional **outfit image upload**.
   - Gemini multimodal model analyzes outfit colors, style aesthetic, and formality.
   - Generates matching jewelry recommendations with links to BlueStone, Tanishq, CaratLane, Melorra, Amazon, and Flipkart.

4. **Recommendation History & Dashboard**
   - Track, filter, search, print, and reuse previous recommendations.
   - User authentication and session management.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Full-Stack Backend:** Node.js Express server (`server.ts`) with Vite dev middleware
- **Python Backend:** FastAPI (`backend_python/app.py`), Pydantic, Uvicorn, Pillow, Jinja2
- **GenAI Foundation Model:** Google `@google/genai` (Gemini 3.8/2.5/1.5 Flash)

---

## 🚀 VS Code Setup & Running Instructions

### Option A: Running the Full-Stack Web Application (Recommended)

1. **Open the project in VS Code:**
   ```bash
   code .
   ```

2. **Verify Node.js is installed:**
   ```bash
   node -v   # Should be v18+
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure your Gemini API Key:**
   Make a copy of `.env.example` named `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (obtainable free from [Google AI Studio](https://aistudio.google.com/)):
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will run at: **`http://localhost:3000`**

---

### Option B: Running the Standalone Python FastAPI Backend

1. **Navigate to the python backend directory:**
   ```bash
   cd backend_python
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install the required packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up `.env`:**
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

5. **Start the FastAPI server with Uvicorn:**
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **Access the application & documentation:**
   - Web App: `http://localhost:8000`
   - Interactive Swagger API Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

---

## 🧪 Testing the Application

### 1. Test Home Interior Planner (Scenario 1)
1. Navigate to **Home Planner** in the top navigation.
2. Enter budget `₹5,000`, 5 lights, 4 ceiling fans, 2 furniture pieces, 1 dining table.
3. Click **Generate Recommendations**.
4. Verify the generated budget breakdown, Amazon/Flipkart/IKEA buttons, and calculation table.

### 2. Test Party Budget Planner (Scenario 2)
1. Navigate to **Party Planner**.
2. Enter budget `₹5,000`, 3 guests, Party type: `Wedding`, Venue: `Home`.
3. Check **Catering**, **Decoration**, and **Entertainment**.
4. Click **Generate Budget Plan**.
5. Check catering options from Swiggy/Zomato, venue suggestions, and contingency reserve.

### 3. Test Jewelry Recommendations with Multimodal Vision (Scenario 3)
1. Navigate to **Jewelry Planner**.
2. Select the `Blue Smart Shirt` sample preset or upload any outfit image.
3. Set budget `₹5,000`, Occasion: `Birthday`, Style: `Minimalist`.
4. Click **Get Recommendations**.
5. Observe the AI Outfit Analysis (detected colors, style, formality) and matching jewelry pieces with Tanishq, CaratLane, and BlueStone links.

### 4. Test History & Dashboard
1. Click **History** in the navigation.
2. Verify all your generated plans are logged with timestamps and budgets.
3. Click **View Full Details** to open the full modal breakdown.
