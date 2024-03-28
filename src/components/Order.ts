import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface IOrder {
  address: string;
  payment: string;
}

export class Order extends Form<IOrder> {
  private _cash: HTMLButtonElement;
  private _card: HTMLButtonElement;

  constructor(blockName: string , container: HTMLFormElement , events: IEvents) {
    super(container, events);
    this._cash = this.container.querySelector<HTMLButtonElement>('button[name="cash"]');
    this._card = this.container.querySelector<HTMLButtonElement>('button[name="card"]');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (this._cash && this._card) {
      this._cash.addEventListener('click', () => this.handlePaymentButtonClick('cash'));
      this._card.addEventListener('click', () => this.handlePaymentButtonClick('card'));
    }
  }

  private handlePaymentButtonClick(paymentMethod: 'cash' | 'card') {
    this._cash.classList.toggle('button_alt-active', paymentMethod === 'cash');
    this._card.classList.toggle('button_alt-active', paymentMethod === 'card');
    this.onInputChange('payment', paymentMethod);
  }

  disableButtons() {
    this._cash.classList.remove('button_alt-active');
    this._card.classList.remove('button_alt-active');
  }

  set address(value: string) {
    const addressInput = this.container.querySelector<HTMLInputElement>('input[name="address"]');
    if (addressInput) {
      addressInput.value = value;
    }
  }
}