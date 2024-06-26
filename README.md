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
- src/styles/styles.scss —  файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами1


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


## Документация

## Model:
    -Класс Model

## View (Представление):
    -Класс Component    
    -Класс Form
    -Класс Page
    -Класс Modal
    -Класс Basket
    -Класс Card
    -Класс Contacts
    -Класс Success
    -Класс Order

## Собыия 
    -modal:close 
    -order:success
    -contactsFormErrors:change'  
    -contacts:submit 
    -order:submit
    -orderFormErrors:change
    -orderInput:change 
    -basket:order 
    -basket:delete 
    -basket:open 
    -card:toBasket  
    -card:select 
    -items:changed 
 
____________________________________________________________________________________________________________________
P.s Я понимаю что работа не идеальна, но осталось мало времени до жесткого дедлайна :(
### Слой Model (Модель):

#### Класс Model:
- Model - абстрактный класс, который служит базовым для всех моделей.
- Конструктор принимает два аргумента:
    - data: объект типа T, который инициализирует свойства модели.
    - events: экземпляр IEvents, используемый для управления событиями.
- В конструкторе свойства модели инициализируются значениями из data с помощью Object.assign.
- Метод emitChanges используется для оповещения об изменениях в модели. Он принимает имя события event и необязательный параметр payload, который содержит дополнительные данные для передачи в событие.
- emitChanges вызывает метод emit экземпляра IEvents, чтобы оповестить об изменениях в модели.

### Класс AppState
Наследует от Model<IAppState>:
AppState также является моделью данных, предназначенной для хранения состояния приложения.

#### Свойства:
- **basket**: Массив строк, представляющий товары в корзине.
- **catalog**: Массив , содержащий информацию о продуктах.
- **order**: Объект, содержащий информацию о заказе, включая адрес, электронную почту, телефон, список товаров, общую сумму и способ оплаты.
- **formErrors**: Объект, содержащий ошибки формы.

#### Методы:
  addToBasket(value: Product): void; Метод для добавления товара в корзину 
  deleteProductBasket(id: string): void; Метод для удаления товара из корзины
  clearBasket(): void; Метод для полной очистки корзины
  setItems(): void; Метод для добавления ID товаров в поле items для order
  setOrderField(field: keyof IOrderForm, value: string): void; Метод для заполнения полей email, phone, address, payment в order
  getBasketCount(): number; Метод для получения количества товаров в корзине
  getTotalPrice(): number; Метод для получения суммы цены всех товаров в корзине
  validateContacts(): boolean; Валидация форм для окошка "контакты"
  validateOrder(): boolean; Валидация форм для окошка "заказ"
  isValidEmail(email: string): boolean; Валидация поля с email
  isValidPhone(phone: string): boolean; Валидация для поля с телефоном
  refreshOrder(): boolean; Очистить order после покупки товаров
  setStore(items: IProduct[]): void; Метод для превращения данных, полученых с сервера в тип данных приложения
  resetSelected(): void;  Метод для обновления поля selected во всех товарах после совершения покупки

_____________________________________________________________________________________________________________________________
### View (Представление):

#### Класс Component

Класс Component представляет собой базовый компонент, который используется для создания других компонентов в приложении. 

**Конструктор:**
Принимает один аргумент - container, который представляет собой DOM-элемент, в который будет встраиваться компонент.
Код в конструкторе выполняется до всех объявлений в дочернем классе.

**Методы:**

- `toggleClass`: Переключает класс у указанного элемента.
- `setText`: Устанавливает текстовое содержимое указанного элемента.
- `setDisabled`: Устанавливает состояние блокировки указанного элемента.
- `setHidden`: Скрывает указанный элемент, устанавливая ему свойство display: none.
- `setVisible`: Показывает указанный элемент, удаляя свойство display: none.
- `setImage`: Устанавливает изображение для указанного элемента <img> с альтернативным текстом.
- `element`: Геттер, возвращающий корневой DOM-элемент компонента.
- `domElement`: Возврвшает DOM-елемент .
- `domButton`: Возвращает DOM- кнопку .
- `render`: Метод для рендеринга компонента, принимает объект data с данными для обновления компонента. Обновляет компонент, применяя данные из data.


### Класс Order

Наследует от Form: Form является базовым классом для форм, который предоставляет функционал для работы с формами. Order использует этот функционал для управления данными формы заказа

#### Свойства:
- **_card**: Свойство принимает DOM-елемент(кнопку), для дальнейшей работы с ней
- **_cash**: Свойство принимает DOM-елемент(кнопку), для дальнейшей работы с ней

#### Методы:
- `setupEventListeners()`:метод устанавливает обработчики событий для кнопок оплаты
- `handlePaymentButtonClick()`:метод вызывается при нажатии на кнопку оплаты. Он принимает аргумент paymentMethod, который указывает, какой метод оплаты был выбран (cash или card)
- `disableButtons()`: метод отключает активное состояние у обеих кнопок оплаты 

#### Класс Page

ласс Page расширяет базовый класс Component<IPage>.

**Интерфейс IPage:**
Описывает структуру данных, ожидаемых для отображения на странице. Содержит счетчик, каталог элементов и флаг блокировки.

**Конструктор:**
Принимает контейнер страницы (HTMLElement) и объект событий (IEvents).
Инициализирует основные элементы страницы, такие как счетчик корзины, каталог товаров и обертка страницы.
При клике на корзину (_basket) генерирует событие "basket:open".

**Методы:**
- `set counter`, `set shop`, `set locked`: Устанавливают значения счетчика, каталога и флага блокировки прокрутки страницы в случаи открытия модального окна. Обновляют содержимое страницы в соответствии с переданными данными.

---

#### Класс Modal

Класс `Modal` представляет модальное окно.функционал этого класса заключается в отображении модального окна с любым содержимым, которое необходимо передавать в качестве аргумента при вызове метода render.

#### Архитектура класса:

- **Наследование**: Класс `Modal` наследуется от класса `Component`.

- **Конструктор**:
  - Принимает два аргумента: `container` - HTML-элемент, представляющий контейнер модального окна, и `events` - экземпляр `IEvents`, используемый для обработки событий.
  - Инициализирует свойства `_closeButton`, `_content`.
  - Устанавливает обработчики событий на кнопку закрытия и клики вне контента модального окна для закрытия его.

- **Методы**:
  - `open()`: Открывает модальное окно и генерирует событие `modal:open`.
  - `close()`: Закрывает модальное окно, удаляет его содержимое и генерирует событие `modal:close`.
  - `render(data: IModalData)`: Вызывается для отображения модального окна, получает разметку, которая используется как контент модального окна.

---
#### Класс Form<T>

Класс `Form<T>` представляет форму веб-страницы.

#### Архитектура класса:

- **Наследование**: Класс `Form<T>` наследуется от класса `Component<IFormState>`.

- **Конструктор**:
  - Принимает два аргумента: `container` - HTML-элемент, представляющий форму, и `events` - экземпляр `IEvents`, используемый для обработки событий.
  - Инициализирует свойства `_submit` и `_errors`, представляющие кнопку отправки формы и контейнер для отображения ошибок, соответственно.
  - Устанавливает обработчики событий на ввод данных в форму и отправку формы.

- **Методы**:
  - `onInputChange(field: keyof T, value: string)`: Обработчик события ввода данных в форму, генерирует событие с изменением данных в форме.
  - `render(state: Partial<T> & IFormState)`: Вызывается для отображения формы с данными из объекта `state`.

#### Свойства класса:

- `_submit`: HTML-элемент кнопки отправки формы.
- `_errors`: HTML-элемент для отображения ошибок формы.
```
```

#### Интерфейс IFormState:
```typescript
interface IFormState {
    valid: boolean;
    errors: string[];
}
```
______________________
_____________________________________________________________________________________________________________

### Класс Basket:
Расширение от базового класса Component:
Класс Basket наследует функциональность базового класса Component, что означает,что он является компонентом представления.


#### Интерфейс IBasketView:

IBasketView определяет интерфейс данных, которые использует компонент корзины. Включает в себя элементы, такие как items, total, selected, itemsInBasket.

#### Конструктор:
Принимает имя блока, контейнер (элемент DOM) и экземпляр EventEmitter, который предоставляет механизм для обработки событий.
Инициализирует свойства компонента, находит необходимые элементы DOM и устанавливает обработчики событий.

#### Методы для работы с корзиной:

- set prise (): Устанавливает цену товара
- set list(): станавливает новый список элементов в корзине, заменяя текущие элементы новыми, и при необходимости отключает кнопку корзины, если список пуст.
- disableButton(): скрывает кнопку
- refreshIndices(): обновляет индексы элементов списка корзины.


### Класс Card:

Класс `Card<T>` представляет карточку товара на веб-странице.

#### Интерфейсы и типы данных:
- ICardActions: Определяет действия, которые могут быть выполнены при взаимодействии с карточкой товара.
- ICard: Описывает структуру данных карточки товара, включая заголовок, описание, изображение, категорию, цену и кнопку.

#### Архитектура класса:

- **Наследование**: Класс `Card` наследуется от класса `Component<ICard>`.

- **Конструктор**:
  - Принимает три аргумента: `blockName` - строка, представляющая имя блока, `container` - HTML-элемент, представляющий контейнер карточки, и `actions` - объект событий, связанных с карточкой.
  - Инициализирует свойства `_title`, `_image`, `_button`, `_category`, `_price`, представляющие соответственно заголовок, изображение, кнопку, категорию и цену карточки.
  - Устанавливает обработчики событий на кнопку карточки.

- **Методы**:
  - `id`: Получает устанавливает идентификатор карточки.
  - `title`: Получает устанавливает заголовок карточки.
  - `category`: Получает устанавливает категорию карточки.
  - `price`: Получает устанавливает цену карточки.
  - `image`: Устанавливает изображение карточки.
  - `selected`: Выбран товар или нет .

```
#### Класс CardInBasket:
Класс представляет элемент карточки в корзине имеет дополнительно index. 
- Конструктор принимает название блока , контейнер (DOM-элемент, содержащий карточку) и действия. Расширяет класс Card.  
```
#### Класс StoreItemPreview:
Класс также представляет элемент магазина, но с дополнительной возможностью отображения предварительной информации о товаре.Расширяет класс Card. 
- Конструктор принимает контейнер (DOM-элемент, содержащий карточку) и действия.



### Класс Contacts:

Класс `Contacts` представляет форму для ввода контактной информации, наследуемую от класса `Form<IContacts>`.

#### Архитектура класса:

- **Наследование**: Класс `Contacts` наследуется от класса `Form<IContacts>`.

- **Конструктор**:
  - Принимает два аргумента: `container` - HTML-элемент, представляющий контейнер формы, и `events` - экземпляр `IEvents`, используемый для обработки событий.


- **Методы**:
  - `set phone(value: string)`: Устанавливает значение телефона.
  - `set email(value: string)`: Устанавливает значение электронной почты.
  - `resetContacts()`: Удаляет значения в полях ввода 

#### Интерфейс IContacts :

```typescript
interface IContacts {
  phone: string;
  email: string;
}

```

### Класс Success:
Класс `Success` представляет форму успешного оформления заказа, наследуемую от класса `Component<ISuccess>`.

#### Архитектура класса:

- **Наследование**: Класс `Success` наследуется от класса `Component<ISuccess>`.

- **Конструктор**:
  - Принимает два аргумента:`blockName` имя блока `container` - HTML-элемент, представляющий контейнер формы, и `actions` - объект событий, связанных с карточкой.
  

### События 
 
 -modal:close : закрытие модального окна 
 -order:success : отображения окна успешной покупки 
 -contactsFormErrors:change' : валидация формы с контактами 
 -contacts:submit : срабатывает при отправке контактной информации в форме
 -order:submit : отправка формы с заказом 
 -orderFormErrors:change : валидация формы с адресом 
 -orderInput:change :  срабатывает при изменении значения ввода в форме заказа. 
 -basket:order : Оформление заказа
 -basket:delete : удаление элимента из корзины 
 -basket:open : открытие корзины 
 -card:toBasket : добавление крточки в корзину 
 -card:select : модальное окно карточки 
 -items:changed : отризовка карточек на странице 
 
 
 