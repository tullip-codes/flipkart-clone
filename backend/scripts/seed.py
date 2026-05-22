"""
Database seed script.

Run once to populate the database with realistic sample data.

Usage:
    cd backend
    python -m scripts.seed
"""

import json
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.database.session import SessionLocal
from app.database.base import Base
from app.database.session import engine
import app.models 

from app.models.category import Category
from app.models.product import Product
from dotenv import load_dotenv

load_dotenv()

CATEGORIES = [
    {"name": "Electronics", "slug": "electronics", "description": "Phones, laptops, gadgets", "icon_url": "📱"},
    {"name": "Fashion", "slug": "fashion", "description": "Clothing and accessories", "icon_url": "👗"},
    {"name": "Home & Furniture", "slug": "home-furniture", "description": "Furniture, decor, appliances", "icon_url": "🛋️"},
    {"name": "Books", "slug": "books", "description": "Bestsellers and textbooks", "icon_url": "📚"},
    {"name": "Sports & Fitness", "slug": "sports-fitness", "description": "Gym and outdoor gear", "icon_url": "🏋️"},
    {"name": "Beauty", "slug": "beauty", "description": "Skincare, haircare, makeup", "icon_url": "💄"},
]

PRODUCTS = [
    # Electronics 
    {
        "title": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "description": "Flagship smartphone with 200MP camera, S Pen, and titanium frame.",
        "price": 89999,
        "original_price": 109999,
        "discount_percent": 18,
        "stock": 45,
        "rating": 4.6,
        "rating_count": 3241,
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Display": "6.8-inch Dynamic AMOLED 2X",
            "Processor": "Snapdragon 8 Gen 3",
            "RAM": "12 GB",
            "Storage": "256 GB",
            "Camera": "200MP + 12MP + 10MP + 10MP",
            "Battery": "5000 mAh",
            "OS": "Android 14 (One UI 6.1)",
        }),
        "category_slug": "electronics",
    },
    {
        "title": "Apple MacBook Air M3",
        "brand": "Apple",
        "description": "Ultralight laptop powered by the M3 chip with 18-hour battery life.",
        "price": 114900,
        "original_price": 124900,
        "discount_percent": 8,
        "stock": 20,
        "rating": 4.8,
        "rating_count": 1872,
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Chip": "Apple M3",
            "RAM": "16 GB Unified",
            "Storage": "512 GB SSD",
            "Display": "15.3-inch Liquid Retina",
            "Battery": "Up to 18 hours",
            "Weight": "1.51 kg",
        }),
        "category_slug": "electronics",
    },
    {
        "title": "Sony WH-1000XM5 Headphones",
        "brand": "Sony",
        "description": "Industry-leading noise cancellation with 30-hour battery.",
        "price": 24990,
        "original_price": 34990,
        "discount_percent": 29,
        "stock": 80,
        "rating": 4.7,
        "rating_count": 5621,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Driver": "30 mm",
            "Battery": "30 hours",
            "Connectivity": "Bluetooth 5.2",
            "ANC": "Yes (8 microphones)",
            "Weight": "250 g",
        }),
        "category_slug": "electronics",
    },
    {
        "title": "OnePlus 12R 5G",
        "brand": "OnePlus",
        "description": "Snapdragon 8 Gen 2, 50MP Hasselblad camera, 100W SUPERVOOC charging.",
        "price": 42999,
        "original_price": 49999,
        "discount_percent": 14,
        "stock": 60,
        "rating": 4.4,
        "rating_count": 2109,
        "image_url": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Display": "6.78-inch AMOLED 120Hz",
            "Processor": "Snapdragon 8 Gen 2",
            "RAM": "8 GB",
            "Storage": "128 GB",
            "Camera": "50MP + 8MP + 2MP",
            "Battery": "5400 mAh",
        }),
        "category_slug": "electronics",
    },
    # Fashion 
    {
        "title": "Men's Slim Fit Chino Pants",
        "brand": "Allen Solly",
        "description": "Premium cotton chinos with stretch comfort, perfect for work or weekend.",
        "price": 1299,
        "original_price": 2499,
        "discount_percent": 48,
        "stock": 200,
        "rating": 4.2,
        "rating_count": 890,
        "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Material": "98% Cotton, 2% Elastane",
            "Fit": "Slim Fit",
            "Occasion": "Casual / Formal",
            "Care": "Machine Washable",
        }),
        "category_slug": "fashion",
    },
    {
        "title": "Women's Anarkali Kurta Set",
        "brand": "W",
        "description": "Elegant floral print kurta with palazzo pants, ideal for festive occasions.",
        "price": 1899,
        "original_price": 3499,
        "discount_percent": 46,
        "stock": 120,
        "rating": 4.5,
        "rating_count": 632,
        "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Fabric": "Pure Cotton",
            "Style": "Anarkali",
            "Occasion": "Festive / Ethnic",
            "Includes": "Kurta + Palazzo + Dupatta",
        }),
        "category_slug": "fashion",
    },
    # Home & Furniture 
    {
        "title": "Ergonomic Office Chair with Lumbar Support",
        "brand": "Green Soul",
        "description": "Breathable mesh back, adjustable armrests, and 360° swivel for all-day comfort.",
        "price": 12999,
        "original_price": 19999,
        "discount_percent": 35,
        "stock": 30,
        "rating": 4.3,
        "rating_count": 1102,
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Material": "Mesh + Metal Frame",
            "Max Load": "120 kg",
            "Seat Height": "42–52 cm (adjustable)",
            "Armrests": "Adjustable 4D",
            "Warranty": "2 Years",
        }),
        "category_slug": "home-furniture",
    },
    {
        "title": "Philips Air Fryer HD9200",
        "brand": "Philips",
        "description": "4.1L capacity, Rapid Air technology, 13-in-1 cooking functions.",
        "price": 6499,
        "original_price": 9995,
        "discount_percent": 35,
        "stock": 55,
        "rating": 4.6,
        "rating_count": 4320,
        "image_url": "https://images.unsplash.com/photo-1585837146751-a44121ebaf1b?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1585837146751-a44121ebaf1b?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Capacity": "4.1 Litres",
            "Power": "1400 W",
            "Temperature": "80–200°C",
            "Functions": "Air Fry, Bake, Grill, Roast",
            "Warranty": "2 Years",
        }),
        "category_slug": "home-furniture",
    },
    # Books
    {
        "title": "Atomic Habits",
        "brand": "James Clear",
        "description": "An easy and proven way to build good habits and break bad ones.",
        "price": 399,
        "original_price": 799,
        "discount_percent": 50,
        "stock": 500,
        "rating": 4.9,
        "rating_count": 28341,
        "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Pages": "320",
            "Language": "English",
            "Publisher": "Penguin Random House",
            "Edition": "Paperback",
        }),
        "category_slug": "books",
    },
    # Sports 
    {
        "title": "Nivia Pro Gym Gloves",
        "brand": "Nivia",
        "description": "Anti-slip grip, wrist support, and breathable mesh for intense workouts.",
        "price": 449,
        "original_price": 899,
        "discount_percent": 50,
        "stock": 300,
        "rating": 4.1,
        "rating_count": 765,
        "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Material": "Synthetic Leather + Mesh",
            "Sizes": "S, M, L, XL",
            "Sport": "Gym / Weightlifting",
            "Wrist Support": "Yes",
        }),
        "category_slug": "sports-fitness",
    },
    # Beauty 
    {
        "title": "Minimalist 10% Niacinamide Serum",
        "brand": "Minimalist",
        "description": "Reduces pore appearance, controls oil, and evens skin tone.",
        "price": 599,
        "original_price": 799,
        "discount_percent": 25,
        "stock": 180,
        "rating": 4.5,
        "rating_count": 9812,
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
        ],
        "specifications": json.dumps({
            "Volume": "30 ml",
            "Skin Type": "All Skin Types",
            "Key Ingredient": "10% Niacinamide + 1% Zinc",
            "Cruelty Free": "Yes",
        }),
        "category_slug": "beauty",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Skip if already seeded
        if db.query(Category).count() > 0:
            print(" Database already seeded. Skipping.")
            return

        print(" Seeding categories...")
        category_map: dict[str, Category] = {}
        for cat_data in CATEGORIES:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()  
            category_map[cat.slug] = cat

        print(" Seeding products...")
        for p_data in PRODUCTS:
            slug = p_data.pop("category_slug")
            category = category_map.get(slug)
            product = Product(**p_data, category_id=category.id if category else None)
            db.add(product)

        db.commit()
        print(f" Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")

    except Exception as e:
        db.rollback()
        print(f" Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()