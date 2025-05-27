document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');
    
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Корзина
    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout');
    
    // Модальное окно
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const orderForm = document.getElementById('order-form');
    
    // Уведомление
    const notification = document.getElementById('notification');
    
    // Данные товаров
    const products = [
        {
            id: 1,
            name: 'Transwager Runner Black',
            price: 8990,
            oldPrice: 9990,
            image: 'assets/images/products/sneaker1.jpg',
            category: 'bestsellers',
            new: false,
            sale: true,
            badge: 'SALE'
        },
        {
            id: 2,
            name: 'Transwager Street White',
            price: 10990,
            oldPrice: null,
            image: 'assets/images/products/sneaker2.jpg',
            category: 'popular',
            new: false,
            sale: false,
            badge: null
        },
        {
            id: 3,
            name: 'Transwager Classic Brown',
            price: 12990,
            oldPrice: null,
            image: 'assets/images/products/sneaker3.jpg',
            category: 'new',
            new: true,
            sale: false,
            badge: 'NEW'
        },
        {
            id: 4,
            name: 'Transwager Urban Beige',
            price: 9990,
            oldPrice: 11990,
            image: 'assets/images/products/sneaker4.jpg',
            category: 'sale',
            new: false,
            sale: true,
            badge: 'SALE'
        },
        {
            id: 5,
            name: 'Transwager Sport Black',
            price: 14990,
            oldPrice: null,
            image: 'assets/images/products/sneaker5.jpg',
            category: 'bestsellers',
            new: false,
            sale: false,
            badge: null
        },
        {
            id: 6,
            name: 'Transwager Premium Brown',
            price: 17990,
            oldPrice: null,
            image: 'assets/images/products/sneaker6.jpg',
            category: 'new',
            new: true,
            sale: false,
            badge: 'NEW'
        },
        {
            id: 7,
            name: 'Transwager Lite White',
            price: 7990,
            oldPrice: 8990,
            image: 'assets/images/products/sneaker7.jpg',
            category: 'sale',
            new: false,
            sale: true,
            badge: 'SALE'
        },
        {
            id: 8,
            name: 'Transwager Vintage Beige',
            price: 13990,
            oldPrice: null,
            image: 'assets/images/products/sneaker8.jpg',
            category: 'popular',
            new: false,
            sale: false,
            badge: null
        },
        {
            id: 9,
            name: 'Transwager Pro Black',
            price: 15990,
            oldPrice: null,
            image: 'assets/images/products/sneaker9.jpg',
            category: 'bestsellers',
            new: false,
            sale: false,
            badge: null
        },
        {
            id: 10,
            name: 'Transwager Air Brown',
            price: 18990,
            oldPrice: null,image: 'assets/images/products/sneaker10.jpg',
            category: 'new',
            new: true,
            sale: false,
            badge: 'NEW'
        },
        {
            id: 11,
            name: 'Transwager Flex White',
            price: 11990,
            oldPrice: 13990,
            image: 'assets/images/products/sneaker11.jpg',
            category: 'sale',
            new: false,
            sale: true,
            badge: 'SALE'
        },
        {
            id: 12,
            name: 'Transwager Ultra Beige',
            price: 19990,
            oldPrice: null,
            image: 'assets/images/products/sneaker12.jpg',
            category: 'popular',
            new: false,
            sale: false,
            badge: null
        }
    ];
    
    // Корзина
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Открыть/закрыть корзину
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    
    function openCart() {
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
    
    function closeCart() {
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Очистка корзины
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        saveCart();
        renderCart();
        showNotification('Корзина очищена');
    });
    
    // Оформление заказа
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Корзина пуста');
            return;
        }
        closeCart();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Закрыть модальное окно
    modalClose.addEventListener('click', function() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Отправка формы заказа
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        cart = [];
        saveCart();
        updateCartCount();
        showNotification('Заказ оформлен! Спасибо за покупку!');
    });
    
    // Рендер товаров в каталоге
    function renderProducts(containerSelector, productsToRender) {
        const container = document.querySelector(containerSelector);
        container.innerHTML = '';
        
        productsToRender.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                ${product.badge ? <div class="product__badge">${product.badge}</div> : ''}
                <div class="product__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product__content">
                    <h3 class="product__title">${product.name}</h3>
                    <div class="product__price">
                        ${product.price.toLocaleString()} ₽
                        ${product.oldPrice ? <span class="product__old-price">${product.oldPrice.toLocaleString()} ₽</span> : ''}
                    </div>
                    <div class="product__actions">
                        <button class="product__btn" data-id="${product.id}">В корзину</button>
                        <button class="product__favorite">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(productElement);
        });
        
        // Добавление в корзину
        document.querySelectorAll('.product__btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);});
        });
        
        // Избранное
        document.querySelectorAll('.product__favorite').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                this.innerHTML = this.classList.contains('active') 
                    ? '<i class="fas fa-heart"></i>' 
                    : '<i class="far fa-heart"></i>';
            });
        });
    }
    
    // Рендер корзины
    function renderCart() {
        if (cart.length === 0) {
            cartItems.innerHTML = '';
            cartEmpty.style.display = 'block';
            cartTotal.style.display = 'none';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartTotal.style.display = 'flex';
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            total += product.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item__content">
                    <h4 class="cart-item__title">${product.name}</h4>
                    <div class="cart-item__price">${product.price.toLocaleString()} ₽</div>
                    <div class="cart-item__actions">
                        <div class="cart-item__quantity">
                            <button class="cart-item__quantity-btn minus" data-id="${product.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="cart-item__quantity-btn plus" data-id="${product.id}">+</button>
                        </div>
                        <button class="cart-item__remove" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Обновление итоговой суммы
        cartTotal.innerHTML = <p>Итого: <span>${total.toLocaleString()} ₽</span></p>;
        
        // Обработчики событий для кнопок в корзине
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                decreaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                increaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Добавление в корзину
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        renderCart();
        showNotification(`${product.name} добавлен в корзину`);
    }
    
    // Увеличение количества
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            saveCart();
            renderCart();
        }
    }// Уменьшение количества
    function decreaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                removeFromCart(productId);
                return;
            }
            saveCart();
            renderCart();
        }
    }
    
    // Удаление из корзины
    function removeFromCart(productId) {
        const product = products.find(p => p.id === productId);
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        renderCart();
        showNotification(`${product.name} удален из корзины`);
    }
    
    // Сохранение корзины в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    // Показать уведомление
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Слайдер хитов продаж
    function initSlider() {
        const sliderContainer = document.querySelector('.slider-container');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const bestsellers = products.filter(p => p.category === 'bestsellers');
        
        // Рендер товаров в слайдере
        renderProducts('.slider-container', bestsellers);
        
        let currentSlide = 0;
        const slideWidth = 280 + 24; // ширина товара + gap
        
        function updateSlider() {
            sliderContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        }
        
        nextBtn.addEventListener('click', function() {
            const maxSlides = Math.ceil((bestsellers.length * slideWidth - sliderContainer.offsetWidth) / slideWidth);
            if (currentSlide < maxSlides) {
                currentSlide++;
                updateSlider();
            }
        });
        
        prevBtn.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
    }
    
    // Инициализация страницы
    function init() {
        // Основной каталог (первые 6 товаров)
        renderProducts('.catalog__grid', products.slice(0, 6));
        
        // Новинки
        const newProducts = products.filter(p => p.new);
        renderProducts('.new-arrivals__grid', newProducts);
        
        // Акции
        const saleProducts = products.filter(p => p.sale);
        renderProducts('.sale__grid', saleProducts);
        
        // Слайдер хитов продаж
        initSlider();
        
        // Обновление счетчика корзины
        updateCartCount();
        
        // Обработчик для кнопки "Показать еще"
        document.querySelector('.catalog__more .btn').addEventListener('click', function(e) {
            e.preventDefault();
            renderProducts('.catalog__grid', products);
            this.style.display = 'none';
        });
        
        // Закрытие корзины при клике вне ее области
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
        
        // Закрытие модального окна при клике вне его области
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    init();
});