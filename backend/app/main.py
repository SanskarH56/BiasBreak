from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.routes import analyze, mitigate, report

import os

app = FastAPI(title="BiasBreak API", description="API for Fairness Auditor")

# Allowed origins: explicit local dev + any Vercel deployment
_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Also allow an explicit production frontend URL set via env var
_FRONTEND_URL = os.environ.get("FRONTEND_URL")
if _FRONTEND_URL:
    _ALLOWED_ORIGINS.append(_FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": "Oops! Your request is missing some required information or is formatted incorrectly. Please check your inputs and try again."}
    )

# Register routers
app.include_router(analyze.router)
app.include_router(mitigate.router)
app.include_router(report.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to BiasBreak API"}

@app.get("/health", tags=["Health"])
def health_check():
    """
    Simple health check endpoint to verify the API is running.
    """
    return {"status": "healthy"}
