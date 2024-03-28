import { IProduct } from '../../types/types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


export interface IBasketView {
  button:HTMLButtonElement;
  list: HTMLElement[];
  price: number;
}

export interface IStoreItemBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string , container: HTMLElement , protected events: IEvents) {
    super(container);
    this._list = this.domElement(blockName, '__list')
    this._price = this.domElement(blockName, '__price')
    this._button = this.domButton(blockName ,'__button')

    if (this._button) {
      this._button.addEventListener('click', () => this.events.emit('basket:order'))
    }
  }

  set price(price: number) {
    this.setText(this._price, price.toString() + ' синапсов');
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    if (!items.length) {
			this.setDisabled(this._button , true);
		}
  }

  disableButton(value:boolean) {
    this.setDisabled(this._button, value)
  }

  refreshIndices() {
    const items = this._list.children;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const indexElement = item.querySelector('.basket__item-index');
        if (indexElement) {
            indexElement.textContent = (i + 1).toString();
        }
    }
} 
}

export interface IProductInBasket extends IProduct {
  id: string;
  index: number;
}

export class StoreItemBasket extends Component<IProductInBasket> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string , container: HTMLElement , actions?: IStoreItemBasketActions
  ) {
    super(container);
    this._title = this.domElement( blockName,'__title');
    this._price = this.domElement(blockName,'__price');
    this._button = this.domButton(blockName,'__button');
    this._index = container.querySelector(`.basket__item-index`);

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onClick(evt);
      });
    }
  }

  set title(value: string) {
    this.setText(this._title, value)
  }

  set price(value: number) {
    this.setText(this._price, value.toString() + ' синапсов')
  }

  set index(value: number) {
    this.setText(this._index, value.toString())
  }
}
