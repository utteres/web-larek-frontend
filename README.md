# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


##Документация


#### CategoryType:
- Тип, описывающий все возможные категории товара.
- Содержит значения:
    - 'другое'
    - 'софт-скил'
    - 'дополнительное'
    - 'кнопка'
    - 'хард-скил'.

#### FormErrors:
- Тип, описывающий ошибки валидации форм.
- Является частичным объектом, содержащим записи для каждого свойства из IOrderForm с типом string.

#### IProduct:
- Интерфейс, описывающий карточку товара в магазине.
- Свойства:
    - id: уникальный ID (строка).
    - description: описание товара (строка).
    - image: ссылка на картинку (строка).
    - title: название товара (строка).
    - category: категория товара (тип CategoryType).
    - price: цена товара, может быть null (число или null).
    - selected: был данный товар добавлен в корзину или нет (булево значение).

#### IAppState:
- Интерфейс, описывающий внутреннее состояние приложения.
- Свойства:
    - basket: Корзина с товарами (массив Product).
    - store: Массив карточек товара (массив Product).
    - order: Информация о заказе при покупке товара (тип IOrder).
    - formErrors: Ошибки при заполнении форм (тип FormErrors).
- Методы:
    - addToBasket(value: Product): void
    - deleteFromBasket(id: string): void
    - clearBasket(): void
    - getBasketAmount(): number
    - getTotalBasketPrice(): number
    - setItems(): void
    - setOrderField(field: keyof IOrderForm, value: string): void
    - validateContacts(): boolean
    - validateOrder(): boolean
    - refreshOrder(): boolean
    - setStore(items: IProduct[]): void
    - resetSelected(): void

#### IOrder:
- Интерфейс, описывающий поля заказа товара.
- Свойства:
    - items: Массив ID купленных товаров (массив строк).
    - payment: Способ оплаты (строка).
    - total: Сумма заказа (число).
    - address: Адрес доставки (строка).
    - email: Электронная почта (строка).
    - phone: Телефон (строка).

#### ICard:
- Интерфейс, описывающий карточку товара.
- Свойства:
    - id: уникальный ID (строка).
    - title: название товара (строка).
    - category: категория товара (строка).
    - description: описание товара (строка).
    - image: ссылка на картинку (строка).
    - price: цена товара, может быть null (число или null).
    - selected: был данный товар добавлен в корзину или нет (булево значение).

#### IPage:
- Интерфейс, описывающий страницу.
- Свойства:
    - counter: Счётчик товаров в корзине (число).
    - store: Массив карточек с товарами (массив HTMLElement).
    - locked: Переключатель для блокировки, отключает прокрутку страницы (булево значение).

#### IBasket:
- Интерфейс, описывающий корзину товаров.
- Свойства:
    - list: Массив элементов li с товаром (массив HTMLElement).
    - price: Общая цена товаров (число).

#### IContacts:
- Интерфейс, описывающий окошко контакты.
- Свойства:
    - phone: Телефон (строка).
    - email: Электронная почта (строка).

#### Model<T>:
- Базовая модель для отличия от простых объектов с данными.
- Абстрактный класс.
- Принимает данные для хранения и эвент эмиттер.
- Метод:
    - constructor(data: Partial<T>, events: IEvents): принимает частичные данные и эвент эмиттер.

#### AppState:
- Класс, описывающий состояние приложения, расширяет класс Model<IAppState>.
- Свойства:
    - basket: Корзина с товарами (массив Product).
    - store: Массив со всеми товарами (массив Product).
    - order: Объект заказа клиента (тип IOrder).
    - formErrors: Объект с ошибками форм (тип FormErrors).
- Методы:
    - addToBasket(value: Product): void
    - deleteFromBasket(id: string): void
    - clearBasket(): void
    - getBasketAmount(): number
    - getTotalBasketPrice(): number
    - setItems(): void
    - setOrderField(field: keyof IOrderForm, value: string): void
    - validateContacts(): boolean
    - validateOrder(): boolean
    - refreshOrder(): boolean
    - setStore(items: IProduct[]): void
    - resetSelected(): void
    - emitChanges(event: string, payload?: object): void

#### Component:
- Абстрактный класс, представляющий базовый компонент.
- Свойства:
    - container: Родительский DOM-элемент (HTMLElement).
- Методы:
    - constructor(container: HTMLElement): конструктор, принимает родительский элемент.
    - toggleClass(element: HTMLElement, className: string, force?: boolean): переключает класс элемента.
    - setText(element: HTMLElement, value: string): устанавливает текстовое содержимое элемента.
    - setDisabled(element: HTMLElement, state: boolean): меняет статус блокировки элемента.
    - setHidden(element: HTMLElement): скрывает элемент.
    - setVisible(element: HTMLElement): показывает элемент.
    - setImage(el: HTMLImageElement, src: string, alt?: string): устанавливает изображение с альтернативным текстом.
    - render(data?: Partial<T>): возвращает корневой DOM-элемент.

#### Page:
- Класс, описывающий главную страницу, наследуется от Component<IPage>.
- Свойства:
    - _counter: Ссылка на счётчик товаров в корзине (HTMLElement).
    - _store: Ссылка на блок с карточками товаров (HTMLElement).
    - _wrapper: Ссылка на блок прокрутки (HTMLElement).
    - _basket: Ссылка на блок корзины (HTMLElement).
- Методы:
    - constructor(container: HTMLElement, events: IEvents): конструктор, принимает родительский элемент и обработчик событий.
    - set counter(value: number): сеттер для счётчика товаров в корзине.
    - set store(items: HTMLElement[]): сеттер для карточек товаров на странице.
    - set locked(value: boolean): сеттер для блока прокрутки.

#### Card:
- Класс, описывающий карточку товара, наследуется от Component<ICard>.
- Свойства:
    - _title: Ссылка на элемент с названием товара (HTMLElement).
    - _image: Ссылка на изображение товара (HTMLImageElement).
    - _category: Ссылка на элемент с категорией товара (HTMLElement).
    - _price: Ссылка на элемент с ценой товара (HTMLElement).
    - _button: Ссылка на кнопку товара (HTMLButtonElement).
    - blockName: Имя блока.
- Методы:
    - constructor(blockName: string, container: HTMLElement, actions?: ICardActions): конструктор, принимает имя блока, родительский контейнер и объект с колбэк функциями.
    - set id(value: string): сеттер для уникального ID.
    - get id(): string: геттер для уникального ID.
    - set title(value: string): сеттер для названия товара.
    - get title(): string: геттер для названия товара.
    - set image(value: string): сеттер для изображения товара.
    - set selected(value: boolean): сеттер для определения выбрали товар или нет.
    - set price(value: number | null): сеттер для цены товара.
    - set category(value: CategoryType): сеттер для категории товара.

#### Basket:
- Класс, описывающий корзину товаров, наследуется от Component<IBasket>.
- Свойства:
    - _list: Ссылка на элемент с товарами в корзине (HTMLElement).
    - _price: Ссылка на элемент с общей ценой товаров (HTMLElement).
    - _button: Ссылка на кнопку "Оформить" (HTMLButtonElement).
    - blockName: Имя блока.
- Методы:
    - constructor(blockName: string, container: HTMLElement, events: IEvents): конструктор, принимает имя блока, родительский элемент и обработчик событий.
    - set price(price: number): сеттер для общей цены.
    - set list(items: HTMLElement[]): сеттер для списка товаров.
    - disableButton(): void: метод отключающий кнопку "Оформить".
    - refreshIndices(): void: метод для обновления индексов таблички при удалении товара из корзины.

#### Order:
- Класс, описывающий окошко заказа товара, наследуется от Form<IOrder>.
- Свойства:
    - _card: Ссылка на кнопку "Карта" (HTMLButtonElement).
    - _cash: Ссылка на кнопку "Наличные" (HTMLButtonElement).
    - blockName: Имя блока.
- Методы:
    - constructor(blockName: string, container: HTMLFormElement, events: IEvents): конструктор, принимает имя блока, родительский элемент и обработчик событий.
    - disableButtons(): void: метод, отключающий подсвечивание кнопок.

#### Contacts:
- Класс, описывающий окошко контактов, наследуется от Form<IContacts>.
- Методы:
    - constructor(container: HTMLFormElement, events: IEvents): конструктор, принимает родительский элемент и обработчик событий.

#### Api:
- Класс для работы с API.
- Свойства:
    - baseUrl: Базовый URL для API (строка).
    - options: Опции для fetch (объект RequestInit).
- Методы:
    - constructor(baseUrl: string, options: RequestInit = {}): принимает базовый URL и опции.
    - handleResponse(response: Response): Promise<Partial<object>>: обрабатывает запрос и возвращает промис с данными.
    - get(uri: string): асинхронный метод для выполнения GET-запроса.
    - post(uri: string, data: object): асинхронный метод для выполнения POST-запроса.

#### EventEmitter:
- Класс, представляющий обработчик событий, реализует интерфейс IEvents.
- Свойства:
    - _events: Map состоящий из событий и подписчиков (Map<EventName, Set<Subscriber>>).
- Методы:
    - constructor(): конструктор.
    - on<T extends object>(eventName: EventName, callback: (event: T) => void): позволяет подписаться на событие.
    - off(eventName: EventName, callback: Subscriber): убирает колбэк с события.
    - emit<T extends object>(eventName: string, data?: T): вызывает событие.
