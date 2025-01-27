import Grid from '../src/grid';
import { OptGrid, OptSummaryData, OptSummaryValueMap } from '../src/types';
import { Omit } from 'utility-types';
import { data as sampleData } from '../samples/basic';
import '../src/css/grid.css';

export default {
  title: 'Summary'
};

function createDefaultSummaryOption() {
  const summary = {
    height: 40,
    columnContent: {
      price: {
        template(valueMap: OptSummaryValueMap) {
          return `MAX: ${valueMap.max}<br>MIN: ${valueMap.min}`;
        }
      },
      downloadCount: {
        template(valueMap: OptSummaryValueMap) {
          return `TOTAL: ${valueMap.sum}<br>AVG: ${valueMap.avg.toFixed(2)}`;
        }
      }
    }
  };
  return summary as OptSummaryData;
}

function createDefaultOptions(): Omit<OptGrid, 'el'> {
  const data = sampleData.slice();
  const columns = [
    { name: 'price', minWidth: 150 },
    { name: 'downloadCount', minWidth: 150 }
  ];
  const summary = createDefaultSummaryOption();

  return { data, columns, summary };
}

function createGrid(customOptions: Record<string, unknown> = {}) {
  const defaultOptions = createDefaultOptions();
  const options = { ...defaultOptions, ...customOptions };
  const el = document.createElement('div');
  el.style.width = '800px';

  const grid = new Grid({ el, ...options });

  return { el, grid };
}

export const positionTop = () => {
  const summary = createDefaultSummaryOption();
  summary.position = 'top';
  const { el } = createGrid({ summary });

  return el;
};

const positionTopNote = `
## Summary Position

- Summary can be positioned \`top\` or \`bottom\`.
- Default value is \`bottom\`. 

`;
positionTop.story = { parameters: { notes: positionTopNote } };

export const positionBottom = () => {
  const summary = createDefaultSummaryOption();
  summary.position = 'bottom';
  const { el } = createGrid({ summary });

  return el;
};
