from app import app, db
from models import *

with app.app_context():
    # Create all tables
    db.create_all()

    # Add some sample data
    # Create categories
    electronics = Category(name='Electronics', description='Electronic devices and accessories')
    clothing = Category(name='Clothing', description='Fashion and apparel')
    books = Category(name='Books', description='Books and publications')

    # Create vendors
    vendor1 = Vendor(name='TechCorp', contact_info='contact@techcorp.com', address='123 Tech St')
    vendor2 = Vendor(name='FashionHub', contact_info='contact@fashionhub.com', address='456 Fashion Ave')

    # Add to session
    db.session.add_all([electronics, clothing, books, vendor1, vendor2])
    db.session.commit()

    # Create products
    products = [
        Product(name='Laptop', description='High-performance laptop', price=999.99, stock=10, category=electronics, vendor=vendor1),
        Product(name='Smartphone', description='Latest smartphone', price=599.99, stock=15, category=electronics, vendor=vendor1),
        Product(name='T-Shirt', description='Cotton t-shirt', price=19.99, stock=50, category=clothing, vendor=vendor2),
        Product(name='Jeans', description='Blue denim jeans', price=49.99, stock=30, category=clothing, vendor=vendor2),
        Product(name='Python Programming', description='Learn Python programming', price=29.99, stock=20, category=books, vendor=vendor1)
    ]

    # Add more products for each category
    for i in range(18):
        products.extend([
            Product(name=f'Gadget {i+3}', description='Cool gadget', price=49.99 + i, stock=20, category=electronics, vendor=vendor1),
            Product(name=f'Clothing Item {i+3}', description='Stylish clothing', price=29.99 + i, stock=40, category=clothing, vendor=vendor2),
            Product(name=f'Book Title {i+3}', description='Interesting book', price=19.99 + i, stock=30, category=books, vendor=vendor1)
        ])

    # Add products to session
    db.session.add_all(products)
    db.session.commit()

    print("Database initialized with sample data!")
