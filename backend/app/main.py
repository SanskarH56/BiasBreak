from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, mitigate, report

app = FastAPI(title="BiasBreak API", description="API for Fairness Auditor")

# Configure CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], # React/Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
