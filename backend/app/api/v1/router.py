from fastapi import APIRouter

from app.api.v1.endpoints.auth import (
    router as auth_router
)

from app.api.v1.endpoints.query import (
    router as query_router
)


from app.api.v1.endpoints.database import (
    router as database_router
)

from app.api.v1.endpoints.schema import (
    router as schema_router
)
from app.api.v1.endpoints.analytics import (
    router as analytics_router
)
from app.api.v1.endpoints.upload import (
    router as upload_router
)
api_router = APIRouter()


api_router.include_router(auth_router)



api_router.include_router(database_router)
api_router.include_router(schema_router)
api_router.include_router(query_router)
api_router.include_router(analytics_router)
api_router.include_router(upload_router)