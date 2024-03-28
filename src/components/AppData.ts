import { IOrder, IProduct, FormErrors, IOrderForm } from '../types/types';
import { Model } from './base/Model';
import { IAppState } from '../types/types';

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export class AppState extends Model<IAppState> {
  basket: Product[] = [];
  goods: Product[];

  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };

  formErrors: FormErrors = {};

  addToBasket(value: Product) {
    this.basket.push(value);
  }

  deleteProductBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
  }

  clearBasket() {
    this.basket.length = 0;
  }

  getBasketCount() {
    return this.basket.length;
  }

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order)
    }
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
   else if (!this.isValidEmail(this.order.email)) {
    errors.email = 'Введен некорректный адрес электронной почты';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    else if (!this.isValidPhone(this.order.phone) && this.order.phone.length < 20) {
      errors.phone = 'Номер телефона должен содержать только цифры';
  }

    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  } 

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  isValidPhone(phone: string): boolean {
    return /^\+?\d{1,3}?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/.test(phone.trim());
  }


  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  refreshOrder() {
    this.order = {
      items: [],
      total: null,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  getTotalPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  setStore(items: IProduct[]) {
    this.goods = items.map((item) => new Product({ ...item, selected: false }, this.events));
    this.emitChanges('items:changed', { store: this.goods });
  }

  resetSelected() {
    this.goods.forEach(item => item.selected = false)
  }
}