import { Component } from './base/Component';

interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  price: number;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _price: HTMLElement;

  constructor(protected blockName: string , container: HTMLElement , actions?: ISuccessActions) {
    super(container);

    this._button = this.domButton(blockName,'__close');
    this._price = this.domElement(blockName, '__description');

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set price(value: number) {
    this.setText(this._price , 'Списано ' + value.toString() + ' синапсов' )
  }
}
