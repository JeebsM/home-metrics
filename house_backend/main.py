from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from routers import meter, legacy

app = FastAPI(docs_url=None)

origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:5174",
    "https://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(legacy.router, prefix='/v1', tags=['legacy'])
app.include_router(meter.router, prefix='/meter', tags=['house_metric'])

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Home Swagger",
        version="1.0.0",
        summary="This is documentation.",
        description="",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/docs", include_in_schema=False)
def overridden_swagger():
	return get_swagger_ui_html(openapi_url="/openapi.json", title="FastAPI", swagger_favicon_url="/static/images/icon-tree.png")

