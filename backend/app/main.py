from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.utils.response import success_response
from app.core.exceptions import AppException
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.error_handler import (
    app_exception_handler,
    global_exception_handler
)
from app.api.v1.endpoints.analytics import router as analytics_router
from app.api.v1.endpoints import csv_query

app = FastAPI(
    title="AI BI Platform"
)

app.include_router(api_router)
app.add_exception_handler(
    AppException,
    app_exception_handler
)
app.include_router(analytics_router)
app.add_exception_handler(
    Exception,
    global_exception_handler
)

app.include_router(csv_query.router)
app.include_router(api_router)
app.add_middleware(LoggingMiddleware)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get("/")
def root():

    return success_response(
    message="AI BI Platform Running"
)