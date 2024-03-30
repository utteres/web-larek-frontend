import { Page } from './components/Page';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Card, CardInBasket, StoreItemPreview } from './components/Card';
import { AppState, Product } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ApiResponse, IOrderForm, IProduct } from './types/types';
import './scss/styles.scss';
import { Basket} from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts , IContacts} from './components/Contacts';
import { Success } from './components/Success';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);
const events = new EventEmitter();

// Шаблоны
const storeProductTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
})


api
  .get('/product')
  .then((res: ApiResponse) => {
    appData.setStore(res.items as IProduct[]);
  })
  .catch((err) => {
    console.error(err);
  });

events.on('items:changed', () => {
  page.shop = appData.goods.map((item) => {
    const product = new Card("card",cloneTemplate(storeProductTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

events.on('card:select', (item: Product) => {
  page.locked = true;
  const product = new StoreItemPreview(cloneTemplate(cardTemplate), {
    onClick: () => {
      events.emit('card:toBasket', item)
    },
  });
  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      selected: item.selected
    }),
  });
});

events.on('card:toBasket', (item: Product) => {
  item.selected = true;
  appData.addToBasket(item);
  page.counter = appData.getBasketCount();
  modal.close();
})

events.on('basket:delete', (item: Product) => {
  appData.deleteProductBasket(item.id);
  item.selected = false;
  if (!appData.basket.length) {
    basket.disableButton(true);
  }
  basket.price = appData.getTotalPrice();
  page.counter = appData.getBasketCount();
  basket.refreshIndices();
})

events.on('basket:order', basketOrder);

events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

events.on('basket:open', () => {
  page.locked = true
  const basketItems = appData.basket.map((item, index) => {
    const storeItem = new CardInBasket('card',cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item)
      }
    );
    if(appData.basket.length){
      basket.disableButton(false)
    }
    return storeItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  modal.render({
    content: basket.render({
      list: basketItems,
      price: appData.getTotalPrice(),
    }),
  });
});

events.on('orderFormErrors:change', orderFormErrorsChange);

events.on('contactsFormErrors:change', сontactsFormErrorsChange);
 
events.on('order:submit', () => {
  appData.order.total = appData.getTotalPrice()
  appData.setItems();
  modal.render({
    content: contacts.render(
      {
        errors: [],
        valid: false,
      }
    ),
  });
})

events.on('contacts:submit', () => {
  api.post('/order', appData.order)
    .then((res) => {
      events.emit('order:success', res);
      appData.clearBasket();
      appData.refreshOrder();
      order.disableButtons();
      page.counter = 0;
      appData.resetSelected();
      contacts.resetContacts();
    })
    .catch((err) => {
      console.log(err)
    })
})



events.on('order:success', (res: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      price: res.total
    })
  })
})


events.on('modal:close', () => {
  page.locked = false;
  appData.refreshOrder();
});

function сontactsFormErrorsChange (errors: Partial<IContacts>) {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
}

function orderFormErrorsChange (errors: Partial<IOrderForm>) {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
};

function basketOrder(){
  const orderContent = order.render({
    address: '',
    valid: false,
    errors: []
  });
  modal.render({
    content: orderContent
  });
};