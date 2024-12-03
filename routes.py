from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from app import app, db
from models import Customer, Product, Order, Cart, Category, Review, Payment, cart_items

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_user.role != role:
                flash('Access unauthorized for your role.')
                return redirect(url_for('home'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/')
def home():
    page = request.args.get('page', 1, type=int)
    per_page = 9
    products = Product.query.paginate(page=page, per_page=per_page)
    categories = Category.query.all()
    return render_template('home.html', products=products.items, categories=categories, pagination=products)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role')  # Get role from form
        
        if Customer.query.filter_by(email=email).first():
            flash('Email already exists')
            return redirect(url_for('register'))
        
        hashed_password = generate_password_hash(password)
        new_customer = Customer(name=name, email=email, password=hashed_password, role=role)
        db.session.add(new_customer)
        db.session.commit()
        
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        customer = Customer.query.filter_by(email=email).first()
        
        if customer and check_password_hash(customer.password, password):
            login_user(customer)
            return redirect(url_for('home'))
        flash('Invalid email or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template('product_detail.html', product=product)

@app.route('/cart')
@login_required
def cart():
    cart = current_user.cart
    cart_items_list = db.session.query(cart_items).filter_by(cart_id=cart.id).all()
    products_with_quantity = []
    for item in cart_items_list:
        product = Product.query.get(item.product_id)
        products_with_quantity.append({'product': product, 'quantity': item.quantity})
    cart_total = sum(p['product'].price * p['quantity'] for p in products_with_quantity)
    return render_template('cart.html', products_with_quantity=products_with_quantity, cart_total=cart_total)

@app.route('/add_to_cart/<int:product_id>', methods=['POST'])
@login_required
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)
    cart = current_user.cart
    if not cart:
        cart = Cart(customer_id=current_user.id)
        db.session.add(cart)
    
    product_in_cart = db.session.query(cart_items).filter_by(cart_id=cart.id, product_id=product.id).first()
    if product_in_cart:
        db.session.execute(cart_items.update().where(cart_items.c.cart_id == cart.id).where(cart_items.c.product_id == product.id).values(quantity=product_in_cart.quantity + 1))
    else:
        db.session.execute(cart_items.insert().values(cart_id=cart.id, product_id=product.id, quantity=1))
    db.session.commit()
    return redirect(url_for('cart'))

@app.route('/remove_from_cart/<int:product_id>', methods=['POST'])
@login_required
def remove_from_cart(product_id):
    product = Product.query.get_or_404(product_id)
    cart = current_user.cart
    if product in cart.products:
        cart.products.remove(product)
        db.session.commit()
    return redirect(url_for('cart'))

@app.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    if request.method == 'POST':
        cart = current_user.cart
        if not cart or not cart.products:
            flash('Your cart is empty')
            return redirect(url_for('cart'))

        total_amount = sum(product.price for product in cart.products)
        order = Order(customer_id=current_user.id, total_amount=total_amount, status='confirmed')

        # Add products to order
        for product in cart.products:
            order.products.append(product)

        # Clear cart
        cart.products = []
        db.session.add(order)
        db.session.commit()

        flash('Your order has been placed successfully!')
        return redirect(url_for('order_confirmation'))
    else:
        #show that inavlid request
        flash('Invalid request')
        # print("Invalid request")
    return render_template('checkout.html')

@app.route('/order_confirmation')
@login_required
def order_confirmation():
    # return render_template('order_confirmation.html')
    return render_template('checkout.html')

@app.route('/order_confirmation/<int:order_id>')
@login_required
def order_confirmation_with_id(order_id):
    order = Order.query.get_or_404(order_id)
    if order.customer_id != current_user.id:
        flash('Unauthorized access')
        return redirect(url_for('home'))
    return render_template('order_confirmation.html', order=order)

@app.route('/orders')
@login_required
def orders():
    user_orders = Order.query.filter_by(customer_id=current_user.id).all()
    return render_template('orders.html', orders=user_orders)

@app.route('/add_review/<int:product_id>', methods=['POST'])
@login_required
def add_review(product_id):
    product = Product.query.get_or_404(product_id)
    rating = request.form.get('rating')
    comment = request.form.get('comment')
    
    review = Review(rating=rating, comment=comment, product_id=product_id)
    db.session.add(review)
    db.session.commit()
    
    return redirect(url_for('product_detail', product_id=product_id))

# Customer Module: Browse and Search
@app.route('/browse')
def browse_products():
    products = Product.query.all()
    return render_template('browse.html', products=products)

@app.route('/search', methods=['GET'])
@login_required
def search():
    query = request.args.get('query')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    category_id = request.args.get('category_id', type=int)
    page = request.args.get('page', 1, type=int)
    per_page = 9

    products = Product.query

    if query:
        products = products.filter(Product.name.ilike(f'%{query}%'))
    if min_price is not None:
        products = products.filter(Product.price >= min_price)
    if max_price is not None:
        products = products.filter(Product.price <= max_price)
    if category_id is not None:
        products = products.filter(Product.category_id == category_id)

    products = products.paginate(page=page, per_page=per_page)
    categories = Category.query.all()

    return render_template('search_results.html', products=products.items, categories=categories, pagination=products)

# Vendor Module: Add and Delete Products
@app.route('/vendor/add_product', methods=['GET', 'POST'])
@login_required
@role_required('vendor')
def add_product():
    if request.method == 'POST':
        name = request.form.get('name')
        price = request.form.get('price')
        description = request.form.get('description')
        stock = request.form.get('stock')
        category_id = request.form.get('category_id')  # Assuming category selection is added to the form
        
        if not stock or not category_id:
            flash('Stock and Category are required fields.')
            return redirect(url_for('add_product'))

        new_product = Product(name=name, price=price, description=description, stock=stock, category_id=category_id, vendor_id=current_user.id)
        db.session.add(new_product)
        db.session.commit()
        return redirect(url_for('vendor_dashboard'))
    categories = Category.query.all()
    return render_template('add_product.html', categories=categories)

@app.route('/vendor/delete_product/<int:product_id>', methods=['POST'])
@login_required
@role_required('vendor')
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    if product.vendor_id != current_user.id:
        flash('Unauthorized action')
        return redirect(url_for('vendor_dashboard'))
    db.session.delete(product)
    db.session.commit()
    return redirect(url_for('vendor_dashboard'))

@app.route('/vendor_dashboard')
@login_required
@role_required('vendor')
def vendor_dashboard():
    vendor_products = Product.query.filter_by(vendor_id=current_user.id).all()
    return render_template('vendor_dashboard.html', products=vendor_products)
