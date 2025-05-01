"""
API Gateway for the Smart Legal Assistance Platform.
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from urllib.parse import urljoin

app = FastAPI(title="Smart Legal Assistance API Gateway")

# Service URLs
AUTH_SERVICE_URL = os.environ.get("AUTH_SERVICE_URL", "http://localhost:8001")
ATTORNEY_SERVICE_URL = os.environ.get("ATTORNEY_SERVICE_URL", "http://localhost:8002")
CLIENT_SERVICE_URL = os.environ.get("CLIENT_SERVICE_URL", "http://localhost:8003")
DOCUMENT_SERVICE_URL = os.environ.get("DOCUMENT_SERVICE_URL", "http://localhost:8004")

# CORS settings
origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    """API gateway root endpoint."""
    return {
        "message": "Smart Legal Assistance API Gateway",
        "services": {
            "auth": AUTH_SERVICE_URL,
            "attorney": ATTORNEY_SERVICE_URL,
            "client": CLIENT_SERVICE_URL,
            "document": DOCUMENT_SERVICE_URL,
        }
    }

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_service_proxy(request: Request, path: str):
    """Proxy requests to the authentication service."""
    return await proxy_request(request, urljoin(AUTH_SERVICE_URL, path))

@app.api_route("/attorneys/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def attorney_service_proxy(request: Request, path: str):
    """Proxy requests to the attorney service."""
    return await proxy_request(request, urljoin(ATTORNEY_SERVICE_URL, f"api/{path}"))

@app.api_route("/clients/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def client_service_proxy(request: Request, path: str):
    """Proxy requests to the client service."""
    return await proxy_request(request, urljoin(CLIENT_SERVICE_URL, f"api/{path}"))

@app.api_route("/documents/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def document_service_proxy(request: Request, path: str):
    """Proxy requests to the document service."""
    return await proxy_request(request, urljoin(DOCUMENT_SERVICE_URL, f"api/{path}"))

async def proxy_request(request: Request, target_url: str):
    """
    Proxy the request to the target service.
    """
    request_method = request.method
    request_headers = dict(request.headers)
    
    # Forward the request body
    request_body = await request.body()
    
    # Client to make requests to the target service
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request_method,
                url=target_url,
                headers=request_headers,
                content=request_body,
                timeout=30.0,
            )
            
            # Return the response from the target service
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 