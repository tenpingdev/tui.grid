import { storiesOf } from '@storybook/html';
import { withKnobs, button } from '@storybook/addon-knobs';
import Grid from '../src/grid';
import { OptGrid } from '../src/types';
import { Omit } from 'utility-types';
import { data } from '../samples/basic';
import { CellRenderer, CellRendererProps } from '../src/renderer/types';
import '../src/css/grid.css';

const stories = storiesOf('Row Headers', module);
stories.addDecorator(withKnobs);

const columns = [
  { name: 'name', minWidth: 150 },
  { name: 'artist', minWidth: 150 },
  { name: 'type', minWidth: 150 },
  { name: 'release', minWidth: 150 },
  { name: 'genre', minWidth: 150 }
];

function alertObjectToJson(obj: object, useSpace?: boolean) {
  alert(JSON.stringify(obj, null, useSpace ? '\t' : null));
}

function createGrid(options: Omit<OptGrid, 'el'>) {
  const el = document.createElement('div');
  el.style.width = '800px';

  const grid = new Grid({ el, ...options });

  return { el, grid };
}

function createButtons(grid) {
  button('check(1)', () => grid.check(1));
  button('uncheck(1)', () => grid.uncheck(1));

  button('checkAll()', () => grid.checkAll());
  button('uncheckAll()', () => grid.uncheckAll());

  button('getCheckedRowKeys()', () => {
    alertObjectToJson(grid.getCheckedRowKeys());
  });

  button('getCheckedRows()', () => {
    alertObjectToJson(grid.getCheckedRows(), true);
  });
}

export class RowNumberRenderer implements CellRenderer {
  private el: HTMLElement;

  public constructor(props: CellRendererProps) {
    const el = document.createElement('span');

    el.innerHTML = `No.${props.value}`;

    this.el = el;
  }

  public getElement() {
    return this.el;
  }

  public changed(props: CellRendererProps) {
    this.el.innerHTML = props.formattedValue;
  }
}

class SingleCheckRenderer implements CellRenderer {
  private el: HTMLLabelElement;

  public constructor(props: CellRendererProps) {
    const { grid, rowKey } = props;

    const label = document.createElement('label');

    label.setAttribute('for', String(rowKey));

    const hiddenInput = document.createElement('input');

    hiddenInput.id = String(rowKey);
    hiddenInput.style.display = 'none';

    const customInput = document.createElement('span');
    const customInputStyle = customInput.style;

    customInput.className = 'custom-input';
    customInputStyle.backgroundColor = '#eee';
    customInputStyle.width = '15px';
    customInputStyle.height = '15px';
    customInputStyle.display = 'inline-block';

    label.appendChild(hiddenInput);
    label.appendChild(customInput);

    hiddenInput.type = 'checkbox';
    hiddenInput.addEventListener('change', () => {
      if (hiddenInput.checked) {
        grid.check(rowKey);
      } else {
        grid.uncheck(rowKey);
      }
    });

    this.el = label;

    this.changed(props);
  }

  public getElement() {
    return this.el;
  }

  public changed(props: CellRendererProps) {
    const hiddenInput = this.el.querySelector('input');
    const customInput: HTMLElement = this.el.querySelector('.custom-input');
    const checked = Boolean(props.value);

    hiddenInput.checked = checked;
    customInput.style.backgroundColor = checked ? 'gray' : '#eee';
  }
}

stories.add('single use - row number', () => {
  const { el } = createGrid({
    data,
    columns,
    rowHeaders: ['_number']
  });
  const rootEl = document.createElement('div');
  rootEl.appendChild(el);

  return rootEl;
});

stories.add(
  'single use -checkbox',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: ['_checked']
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'single use - radio',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: [
        {
          name: '_checked',
          rendererOptions: { inputType: 'radio' }
        }
      ]
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'multi use - checkbox, row number',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: ['_checked', '_number']
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'multi use - radio, row number',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: [
        {
          name: '_checked',
          rendererOptions: { inputType: 'radio' }
        },
        '_number'
      ]
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'set object type option',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: [
        {
          title: 'row number',
          name: '_number',
          width: 100,
          align: 'left'
        },
        {
          title: 'checkbox',
          name: '_checked',
          width: 100,
          align: 'left'
        }
      ]
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'use custom renderer - row number',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: [
        {
          name: '_number',
          renderer: RowNumberRenderer
        }
      ]
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'use custom renderer - checkbox',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: [
        {
          name: '_checked',
          renderer: SingleCheckRenderer
        }
      ]
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);

stories.add(
  'use frozen columns',
  () => {
    const { el, grid } = createGrid({
      data,
      columns,
      rowHeaders: ['_number', '_checked'],
      columnOptions: {
        frozenCount: 2
      }
    });
    const rootEl = document.createElement('div');
    rootEl.appendChild(el);

    createButtons(grid);

    return rootEl;
  },
  { html: { preventForcedRender: true } }
);