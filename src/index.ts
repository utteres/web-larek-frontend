import './scss/styles.scss';
import { ShopAPI } from './components/ShopAPI';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderForm } from './types/types';
import  {  } from 'lodash';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/AppData';
import { CatalogItem } from './components/Card';
import { Success } from './components/common/Success';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';

const events = new EventEmitter();
const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek'
const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek'
const api = new ShopAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);

// Глобальные контейнер\
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создание экземпляра BasketModal
// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardBasketModal = ensureElement<HTMLTemplateElement>('#card-basket');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//элементы
const modalAction = document.querySelector('.modal__actions');
const doOrderButton = modalAction.querySelector('.button');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactTemplate), events);

// Связываем логику загрузки товаров в корзину событием load окна
window.addEventListener('load', () => {
	const storedItems = localStorage.getItem('basketItems');
	if (storedItems) {
		const parsedItems = JSON.parse(storedItems);
		// Обновляем состояние корзины
		parsedItems.forEach((item: ProductItem) => basket.addItemToBasket(item));
	}
});

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//отрисовка карточек на странице
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});
	page.counter = basket.getItemsInBasket().length;
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address } = errors;
	order.valid = !email && !phone && !address;
	order.errors = Object.values({ phone, email, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\.(payment|address):change/,
	(data: { field: keyof IOrderForm; value: 'offline' | 'online' }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// отслеживание способа оплаты
events.on(
	'payment:changed',
	(data: { field: 'payment'; value: 'online' | 'offline' | null }) => {
		appData.setOrderField(data.field, data.value);
	}
); 

// Открыть  продукт
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate));
	modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price, // отсутствует слово синапсов (почему не знаю) возможно из за типа number
			category: item.category,
		}),
	});
	const modalContainer = document.querySelector('#modal-container');
	const addToBasketButton = modalContainer.querySelector(
		'.card .card__button'
	) as HTMLButtonElement;
	const productId = item.id;
	const basketItems = basket.getItemsInBasket();
	// Проверяем, есть ли товар уже в корзине
	const isItemInBasket = basketItems.some((item) => item.id === productId);
	if (isItemInBasket) {
		// Если товар уже есть в корзине, делаем кнопку неактивной
		addToBasketButton.disabled = true;
		addToBasketButton.classList.add('disabled');
		addToBasketButton.textContent = 'Товар уже в корзине';
	} else if (item.price === null) {
		addToBasketButton.disabled = true;
		addToBasketButton.classList.add('disabled');
		addToBasketButton.textContent = 'Товар временно недоступен';
	}

	// кнопка добавления товара в корзину
	addToBasketButton.addEventListener('click', () => {
		if (!isItemInBasket) {
			// Если товара нет в корзине, добавляем его
			basket.addItemToBasket(item);
			localStorage.setItem(
				'basketItems',
				JSON.stringify(basket.getItemsInBasket())
			);
			modal.close();
			page.counter = basket.getItemsInBasket().length;
		}
	});
});

//открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

//оформить заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Подписываемся на событие открытия формы для ввода контактной информации
events.on('contact:open', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//отправка заказа
events.on('payment:submit', () => {
	const email = contact.getEmail(); // Получаем почту
	const phone = contact.getPhone(); // Получаем номер телефона
	const total = basket.updateTotal(); // Получаем сумму заказа
	const productsId = basket.getItemId(); // Получаем заказанные товары

	// Обновляем свойства объекта appData.order
	appData.order.email = email;
	appData.order.phone = phone;
	appData.order.total = total;
	appData.order.items = productsId;

	api
		.orderProduct(appData.order)
		.then((result) => {
			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				},
				total
			);
			success.setTotal(total);

			modal.render({
				content: success.render({}),
			});
			basket.clearBasket();
		})
		.catch((err) => {
			console.log(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
