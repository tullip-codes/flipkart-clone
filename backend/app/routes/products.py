from fastapi import APIRouter

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("/")
def get_products():
    return {
        "message": "Products route working"
    }