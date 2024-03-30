import { Component } from './base/Component';
import { CategoryType , ICard , CategoryObject} from '../types/types';
import { ensureElement} from '../utils/utils';
import { CDN_URL } from '../utils/constants';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _image: HTMLImageElement;

  constructor(protected blockName: string , container: HTMLElement , actions?: ICardActions ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._button = this.domButton( blockName , '__button')
    this._category = this.domElement(blockName , '__category');
    this._price = this.domElement(blockName , '__price');

  

    if (this._image && actions && typeof actions.onClick === 'function') {
			const element = this._button ? this._button : container;
			element.addEventListener('click', actions.onClick);
		}
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title , value);
  }
  get title(): string {
   return this.getText(this._title)
  
  }

  set image(value: string) {
    if (this._image) {
        this._image.src = CDN_URL + value;
    }
}

  set selected(value: boolean) {
    if (!this._button.disabled) {
      this._button.disabled = value;
    }
  }

  set price(value: number | null) {
    this._price.textContent = value? value.toString() + ' синапсов': 'Бесценно';
    if (this._button && !value) {
      this._button.disabled = true;
    }
  }

  set category(value: CategoryType) {
		this.setText(this._category, value);
		for (const key in CategoryObject) {
			if (key === value) {
				this._category.classList.add(CategoryObject[key]);
			}
		}
	}
}



export class StoreItemPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._description = this.domElement(this.blockName , '__text');
  }

  set description(value: string) {
    this.setText(this._description , value)
  }
}

export class CardInBasket extends Card {
protected _index: HTMLElement;
  constructor(protected blockName: string , container: HTMLElement , actions?: ICardActions ) {
    super('card', container, actions);
    this._index = container.querySelector(`.basket__item-index`);

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onClick(evt);
      });
    }
}
set index(value: number) {
  if (this._index){
  this.setText(this._index, value.toString())
  }
}
}

  