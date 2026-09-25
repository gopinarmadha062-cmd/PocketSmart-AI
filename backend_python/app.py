"""
PocketSmart AI: FastAPI Application
FastAPI backend service layer for routing, session control, user auth, and Gemini AI planner endpoints.
"""

import os
import json
import re
import base64
import shutil
import urllib.parse
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Union

from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    File,
    UploadFile,
    Form,
    Request,
    status,
    Cookie
)
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from dotenv import load_dotenv
import asyncio
import uuid

from models import (
    RegisterUser,
    LoginUser,
    Token,
    UserInDB,
    HomeBudgetInput,
    PartyBudgetInput,
    JewelryBudgetInput
)
from gemini_utils import (
    get_home_recommendations,
    get_party_recommendations,
    get_jewelry_recommendations
)

load_dotenv()

# FastAPI app initialization
app = FastAPI(
    title="PocketSmart: AI Budget Planner",
    description="GenAI-powered, cross-platform recommendation system for home decor, event planning, and jewelry shopping.",
    version="1.0.0"
)

SECRET_KEY = os.getenv("SECRET_KEY", "pocketsmart_secret_jwt_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories for static uploads and templates
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("templates", exist_ok=True)

try:
    templates = Jinja2Templates(directory="templates")
    app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception:
    templates = None

# In-memory database
users_db: Dict[str, Dict[str, Any]] = {
    "sai": {
        "id": "usr_sai_1",
        "username": "sai",
        "email": "sai@example.com",
        "full_name": "Sai Kumar",
        "password": "password123"
    }
}

active_sessions: Dict[str, Dict[str, Any]] = {}
user_recommendations: Dict[str, List[Dict[str, Any]]] = {}


def save_upload_file(upload_file: UploadFile) -> str:
    """Save an uploaded outfit image to static/uploads/"""
    file_id = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{upload_file.filename}"
    file_path = os.path.join("static/uploads", file_id)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return file_path


def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    user = users_db.get(username.lower())
    if user and user["password"] == password:
        return UserInDB(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            full_name=user.get("full_name")
        )
    return None


async def get_current_user(request: Request) -> Optional[UserInDB]:
    auth_header = request.headers.get("Authorization")
    username = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]
        # Simple token lookup
        for u, s in active_sessions.items():
            if s.get("token") == token:
                username = u
                break
    if not username:
        # Fallback to query or default test user
        username = request.query_params.get("username", "sai")
    
    user = users_db.get(username.lower())
    if user:
        return UserInDB(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            full_name=user.get("full_name")
        )
    return None


# ---------------- API ROUTES ----------------

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "PocketSmart AI"}


@app.post("/register")
async def register(user: RegisterUser):
    u = user.username.lower().strip()
    if u in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    users_db[u] = {
        "id": f"usr_{uuid.uuid4().hex[:8]}",
        "username": u,
        "email": user.email,
        "full_name": user.full_name,
        "password": user.password
    }
    token = f"token_{u}_{uuid.uuid4().hex[:12]}"
    active_sessions[u] = {
        "username": u,
        "token": token,
        "login_time": datetime.utcnow().isoformat(),
        "last_activity": datetime.utcnow().isoformat(),
        "user_data": {}
    }
    return {"message": "User registered successfully", "access_token": token, "username": u}


@app.post("/login")
@app.post("/token")
async def login(credentials: LoginUser):
    user = authenticate_user(credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = f"token_{user.username}_{uuid.uuid4().hex[:12]}"
    active_sessions[user.username] = {
        "username": user.username,
        "token": token,
        "login_time": datetime.utcnow().isoformat(),
        "last_activity": datetime.utcnow().isoformat(),
        "user_data": active_sessions.get(user.username, {}).get("user_data", {})
    }
    return {"access_token": token, "token_type": "bearer", "username": user.username}


@app.post("/logout")
async def logout(request: Request):
    user = await get_current_user(request)
    if user and user.username in active_sessions:
        del active_sessions[user.username]
    return {"message": "Logged out successfully"}


@app.get("/session-info")
async def get_session_info(request: Request, current_user: Optional[UserInDB] = Depends(get_current_user)):
    if not current_user or current_user.username not in active_sessions:
        raise HTTPException(status_code=404, detail="No active session found")
    session = active_sessions[current_user.username]
    return {
        "username": session["username"],
        "login_time": session["login_time"],
        "last_activity": session["last_activity"],
        "user_data": session.get("user_data", {})
    }


@app.post("/session-data")
async def update_session_data(data: Dict[str, Any], current_user: Optional[UserInDB] = Depends(get_current_user)):
    username = current_user.username if current_user else "sai"
    if username not in active_sessions:
        active_sessions[username] = {
            "username": username,
            "login_time": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat(),
            "user_data": {}
        }
    active_sessions[username]["user_data"].update(data)
    active_sessions[username]["last_activity"] = datetime.utcnow().isoformat()
    return {"message": "Session data updated", "data": active_sessions[username]["user_data"]}


# SCENARIO 1: HOME PLANNER
@app.post("/home-budget")
@app.post("/generate-home")
async def plan_home_budget(budget_input: HomeBudgetInput, request: Request):
    current_user = await get_current_user(request)
    username = current_user.username if current_user else "sai"

    result = get_home_recommendations(budget_input)
    
    # Save recommendation
    rec_id = f"home_{uuid.uuid4().hex[:8]}"
    result["id"] = rec_id
    result["timestamp"] = datetime.utcnow().isoformat()

    if username not in user_recommendations:
        user_recommendations[username] = []
    
    user_recommendations[username].append({
        "id": rec_id,
        "timestamp": result["timestamp"],
        "recommendation_type": "home",
        "input_summary": budget_input.dict(),
        "result_summary": {
            "total_budget": result.get("total_budget"),
            "remaining_budget": result.get("remaining_budget"),
            "item_count": sum(c.get("items_count", 0) for c in result.get("calculation_table", []))
        },
        "full_result": result
    })

    return result


# SCENARIO 2: PARTY PLANNER
@app.post("/party-budget")
@app.post("/generate-party")
async def plan_party_budget(budget_input: PartyBudgetInput, request: Request):
    current_user = await get_current_user(request)
    username = current_user.username if current_user else "sai"

    result = get_party_recommendations(budget_input)

    rec_id = f"party_{uuid.uuid4().hex[:8]}"
    result["id"] = rec_id
    result["timestamp"] = datetime.utcnow().isoformat()

    if username not in user_recommendations:
        user_recommendations[username] = []

    user_recommendations[username].append({
        "id": rec_id,
        "timestamp": result["timestamp"],
        "recommendation_type": "party",
        "input_summary": budget_input.dict(),
        "result_summary": {
            "total_budget": result.get("total_budget"),
            "remaining_budget": result.get("remaining_budget"),
            "item_count": sum(c.get("items_count", 0) for c in result.get("calculation_table", []))
        },
        "full_result": result
    })

    return result


# SCENARIO 3: JEWELRY PLANNER
@app.post("/jewelry-budget")
@app.post("/generate-jewelry")
async def plan_jewelry_budget(
    total_budget: float = Form(...),
    occasion: str = Form(...),
    preferences: Optional[str] = Form("Minimalist"),
    image: Optional[UploadFile] = File(None),
    request: Request = None
):
    current_user = await get_current_user(request)
    username = current_user.username if current_user else "sai"

    image_path = None
    if image:
        image_path = save_upload_file(image)

    budget_input = JewelryBudgetInput(
        total_budget=total_budget,
        occasion=occasion,
        preferences=preferences,
        image_path=image_path
    )

    result = get_jewelry_recommendations(budget_input, image_path=image_path)

    rec_id = f"jewelry_{uuid.uuid4().hex[:8]}"
    result["id"] = rec_id
    result["timestamp"] = datetime.utcnow().isoformat()

    if username not in user_recommendations:
        user_recommendations[username] = []

    user_recommendations[username].append({
        "id": rec_id,
        "timestamp": result["timestamp"],
        "recommendation_type": "jewelry",
        "input_summary": {
            "total_budget": total_budget,
            "occasion": occasion,
            "preferences": preferences,
            "has_image": bool(image_path)
        },
        "result_summary": {
            "total_budget": result.get("total_budget"),
            "remaining_budget": result.get("remaining_budget"),
            "item_count": len(result.get("jewelry_recommendations", []))
        },
        "full_result": result
    })

    return result


# RECOMMENDATION HISTORY & DETAILS
@app.get("/recommendation-history")
async def get_history(request: Request):
    current_user = await get_current_user(request)
    username = current_user.username if current_user else "sai"
    history = user_recommendations.get(username, [])
    # Sort newest first
    sorted_history = sorted(history, key=lambda x: x["timestamp"], reverse=True)
    return {"history": sorted_history}


@app.get("/recommendations-details/{recommendation_id}")
async def get_recommendation_details(recommendation_id: str, request: Request):
    current_user = await get_current_user(request)
    username = current_user.username if current_user else "sai"
    user_history = user_recommendations.get(username, [])
    for rec in user_history:
        if rec["id"] == recommendation_id:
            return rec
    raise HTTPException(status_code=404, detail="Recommendation not found")


# Startup background task for session cleanup
@app.on_event("startup")
async def startup_event():
    async def cleanup_expired_sessions():
        while True:
            await asyncio.sleep(300)
            now = datetime.utcnow()
            expired = []
            for u, s in active_sessions.items():
                last_act = datetime.fromisoformat(s["last_activity"])
                if (now - last_act).total_seconds() > 1800:
                    expired.append(u)
            for u in expired:
                del active_sessions[u]

    asyncio.create_task(cleanup_expired_sessions())


if __name__ == "__main__":
    import uvicorn
    print("Starting PocketSmart: AI Budget Planner on port 8000...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
