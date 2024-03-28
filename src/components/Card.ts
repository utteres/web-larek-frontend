import { Component } from './base/Component';
import { CategoryType , ICard , CategoryObject} from '../types/types';
import { ensureElement} from '../utils/utils';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek'
export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string , container: HTMLElement , actions?: ICardActions ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container );
    this._button = this.domButton( blockName , '__button')
    this._category = this.domElement(blockName , '__category');
    this._price = this.domElement(blockName , '__price');


    if (actions && typeof actions.onClick === 'function') {
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
    this._image.src = CDN_URL + value;
  }

  set selected(value: boolean) {
    if (!this._button.disabled) {
      this._button.disabled = value;
    }
  }

  set price(value: number | null) {
    this._price.textContent = value? value.toString() + ' синапсов': 'Нет цены';
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

export class StoreItem extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
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

  