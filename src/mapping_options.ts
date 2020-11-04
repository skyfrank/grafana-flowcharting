import { FlowchartHandler } from './flowchartHandler';
import { RulesHandler } from 'rulesHandler';
import { Rule, EventMap } from 'rule_class';
import { $GF } from 'globals_class';
import grafana from 'grafana_func';
import _ from 'lodash';
import { MetricHandler } from './metricHandler';

export class MappingOptionsCtrl {
  $scope: gf.TMappingOptionsScope;
  ctrl: any;
  panel: any;
  flowchartHandler: FlowchartHandler;
  rulesHandler: RulesHandler;
  metricHandler: MetricHandler;
  unitFormats: any;
  parentDiv: HTMLDivElement;
  style = $GF.CONSTANTS.COLORMETHODS;
  metricType: gf.TSelectString[] = $GF.CONSTANTS.METRIC_TYPES;
  colorOn = $GF.CONSTANTS.COLOR_APPLYON;
  linkOn = $GF.CONSTANTS.LINK_APPLYON;
  tooltipOn = $GF.CONSTANTS.TOOLTIP_APPLYON;
  textOn = $GF.CONSTANTS.TEXT_APPLYON;
  textReplace = $GF.CONSTANTS.TEXTMETHODS;
  EventType = EventMap.getDefaultMethods();
  tpDirection: gf.TSelectString[] = $GF.CONSTANTS.TOOLTIP_DIRECTION_TYPES;
  propTypes: gf.TSelectString[] = $GF.CONSTANTS.IDENT_TYPES;
  textPattern = '/.*/';
  rulesTableData: gf.TTableData;
  rulesTable: GFTable;
  metricTypes = $GF.CONSTANTS.VALUE_TYPES;
  dateFormats: gf.TSelectString[] = $GF.CONSTANTS.VALUE_DATEFORMAT_TYPES;
  aggregationTypes = $GF.CONSTANTS.AGGREGATION_TYPES;
  mappingTypes = $GF.CONSTANTS.VALUEMAPPINGTYPES;
  tpGraphType = $GF.CONSTANTS.TOOLTIP_GRAPH_TYPES;
  tpGraphScale = $GF.CONSTANTS.TOOLTIP_GRAPH_SCALE_TYPES;
  tpGraphSize = $GF.CONSTANTS.TOOLTIP_GRAPH_SIZE_TYPES;
  getMetricNames: () => any[];
  getCellNames: (prop: gf.TPropertieKey) => any[];
  getCellNamesById: () => any[];
  getCellNamesByValue: () => any[];
  getVariables: () => any;
  // getEventValues: () => any;
  getEventValues: string[];

  /** @ngInject */
  constructor($scope: gf.TMappingOptionsScope, $element) {
    $scope.editor = this;
    $scope.$GF = $GF.me();
    this.$scope = $scope;
    this.ctrl = $scope.ctrl;
    this.panel = this.ctrl.panel;
    const $div = $element.find('#templateMapping');
    this.parentDiv = $div[0];
    const $rulesTable = $div.find('#RulesTable');
    const rulesTable = $rulesTable[0];
    this.rulesHandler = this.ctrl.rulesHandler;
    this.flowchartHandler = this.ctrl.flowchartHandler;
    this.rulesHandler = this.ctrl.rulesHandler;
    this.metricHandler = this.ctrl.metricHandler;
    this.unitFormats = grafana.getUnitFormats();
    this.tpGraphSize = $GF.CONSTANTS.TOOLTIP_GRAPH_SIZE_TYPES;
    this.rulesTableData = {
      data: this.rulesHandler.getRules(),
      columns: [
        {
          index: 0,
          id: 'expand',
          label: '<>',
          desc: 'Expand/collapse',
          size: '30px',
          sort: 'asc',
          select: false,
        },
        {
          index: 1,
          id: 'rule',
          label: 'Rule',
          desc: 'Rule Name',
          size: '100px',
          sort: 'asc',
          select: false,
        },
        {
          index: 2,
          id: 'level',
          label: 'Lvl',
          desc: 'Highest level',
          size: '40px',
          sort: 'asc',
          select: false,
        },
        {
          index: 3,
          id: 'rval',
          label: 'R. val.',
          desc: 'Raw value',
          size: '100px',
          sort: 'asc',
          select: false,
        },
        {
          index: 4,
          id: 'fval',
          label: 'F. val.',
          desc: 'Formated value',
          size: '100px',
          sort: 'asc',
          select: false,
        },
        {
          index: 5,
          id: 'color',
          label: 'Color',
          desc: 'Highest color',
          size: '100px',
          sort: 'asc',
          select: false,
        },
        {
          index: 6,
          id: 'actions',
          label: 'Actions',
          desc: 'Actions',
          size: '100px',
          sort: 'asc',
          select: false,
        },
      ],
    };

    this.rulesTable = new GFTable(this.rulesTableData, rulesTable);

    this.getMetricNames = (): string[] => {
      return this.metricHandler.getNames('serie');
    };

    this.getCellNames = (prop: gf.TPropertieKey = 'id'): string[] => {
      const flowchart = this.flowchartHandler.getFlowchart();
      const cells = flowchart.getNamesByProp(prop);
      const uniq = new Set(cells);
      let filter = [...uniq];
      filter = filter.filter(e => e !== undefined && e.length > 0);
      return filter;
    };

    this.getCellNamesById = (): string[] => {
      return this.getCellNames('id');
    };

    this.getCellNamesByValue = (): string[] => {
      return this.getCellNames('value');
    };

    this.getVariables = () => {
      return $GF.getFullAvailableVarNames();
    };

    this.getEventValues = [];
  }

  isFirstRule(index: number): boolean {
    if (index === 0) {
      return true;
    }
    return false;
  }

  isOnlySeries(): boolean {
    const bool = this.metricHandler.isTypeOf('serie') && !this.metricHandler.isTypeOf('table');
    return bool;
  }

  isOnlyTables(): boolean {
    const bool = !this.metricHandler.isTypeOf('serie') && this.metricHandler.isTypeOf('table');
    return bool;
  }

  isMultipleType(): boolean {
    const bool = this.metricHandler.isTypeOf('serie') && this.metricHandler.isTypeOf('table');
    return bool;
  }

  initType(rule: Rule) {
    if (this.isOnlyTables()) {
      rule.data.metricType = 'table';
    } else if (this.isOnlySeries()) {
      rule.data.metricType = 'serie';
    }
  }

  getTablesName(): string[] {
    return this.metricHandler.getNames('table');
  }

  getColumnsForTable(tableName: string): string[] {
    return this.metricHandler.getColumnsName(tableName, 'table');
  }

  isLastRule(index: number): boolean {
    const count = this.rulesHandler.countRules();
    if (index === count - 1) {
      return true;
    }
    return false;
  }

  render() {
    this.ctrl.render();
  }

  setUnitFormat(rule: Rule, subItem: any) {
    rule.data.unit = subItem.value;
    this.onRulesChange();
  }

  onRulesChange() {
    $GF.log.info('MappingOptionsCtrl.onRulesChange()');
    this.flowchartHandler.onRulesChange();
    this.render();
    return true;
  }

  getLevels(rule: Rule): gf.TSelectNumber[] {
    let lvl: gf.TSelectNumber[] = [];
    let count = rule.data.colors.length;
    for (let index = 0; index < count; index++) {
      lvl.push({ text: `${index}`, value: index });
    }
    return lvl;
  }

  removeShapeMap(rule: Rule, index: number) {
    const shape = rule.getShapeMap(index);
    this.unselectCell(rule.data.shapeProp, shape.data.pattern);
    rule.removeShapeMap(index);
  }

  removeTextMap(rule: Rule, index: number) {
    const txt = rule.getTextMap(index);
    this.unselectCell(rule.data.textProp, txt.data.pattern);
    rule.removeTextMap(index);
  }

  removeLinkMap(rule: Rule, index: number) {
    const lnk = rule.getLinkMap(index);
    this.unselectCell(rule.data.linkProp, lnk.data.pattern);
    rule.removeLinkMap(index);
  }

  removeEventMap(rule: Rule, index: number) {
    const evt = rule.getEventMap(index);
    this.unselectCell(rule.data.eventProp, evt.data.pattern);
    rule.removeEventMap(index);
  }

  /**
   * Add Color
   *
   * @param {Number} ruleIndex
   * @param {Number} colorIndex
   * @memberof MappingOptionsCtrl
   */
  onColorChange(ruleIndex: number, colorIndex: number) {
    return (newColor: any) => {
      const rule = this.rulesHandler.getRule(ruleIndex);
      rule.data.colors[colorIndex] = newColor;
      this.onRulesChange();
    };
  }

  /**
   * Display cell selection in graph
   * @param  {} prop
   * @param  {} value
   */
  async selectCell(prop: gf.TPropertieKey, value: string) {
    const flowchart = this.flowchartHandler.getFlowchart();
    const xgraph = flowchart.getXGraph();
    if (xgraph) {
      xgraph.selectMxCells(prop, value);
    }
  }

  /**
   * Undisplay cell selection
   *
   * @memberof MappingOptionsCtrl
   */
  async unselectCell(prop: gf.TPropertieKey, value: string) {
    const flowchart = this.flowchartHandler.getFlowchart();
    const xgraph = flowchart.getXGraph();
    if (xgraph) {
      xgraph.unselectMxCells(prop, value);
    }
  }

  /**
   * Disable/Enable rule
   *
   * @param {Rule} rule
   * @param {boolean} bool
   * @memberof MappingOptionsCtrl
   */
  toggleShow(rule: Rule, bool: boolean) {
    rule.data.hidden = bool;
    this.onRulesChange();
  }

  /**
   * Turn Highlight on of cells in rule
   *
   * @param {*} rule
   * @memberof MappingOptionsCtrl
   */
  async highlightCells(rule: Rule) {
    rule.highlightCells();
  }

  /**
   * Turn Highlight off of cells in rule
   *
   * @param {*} rule
   * @memberof MappingOptionsCtrl
   */
  async unhighlightCells(rule: Rule) {
    rule.unhighlightCells();
  }

  /**
   * Turn Highlight off all cells
   *
   * @param {*} rule
   * @memberof MappingOptionsCtrl
   */
  async unhighlightAllCells() {
    const flowchart = this.flowchartHandler.getFlowchart();
    const xgraph = flowchart.getXGraph();
    if (xgraph) {
      xgraph.unhighlightCells();
    }
  }

  //
  // RULE
  //

  /**
   * Remove a rule
   *
   * @param {Rule} rule
   * @param {boolean} [force]
   * @memberof MappingOptionsCtrl
   */
  removeRule(rule: Rule, force?: boolean) {
    if (rule.removeClick === 1 || force) {
      this.rulesHandler.removeRule(rule);
      this.onRulesChange();
    }
    rule.removeClick = 1;
    window.setInterval(() => {
      if (rule) {
        rule.removeClick = 2;
      }
    }, 2000);
  }

  /**
   * Clone a rule
   *
   * @param {Rule} rule
   * @memberof MappingOptionsCtrl
   */
  cloneRule(rule: Rule) {
    this.rulesHandler.cloneRule(rule);
    this.onRulesChange();
  }

  /**
   * Move rule up or down
   *
   * @param {Rule} rule
   * @param {boolean} up
   * @memberof MappingOptionsCtrl
   */
  moveRule(rule: Rule, up: boolean) {
    if (up) {
      this.rulesHandler.moveRuleToUp(rule);
    } else {
      this.rulesHandler.moveRuleToDown(rule);
    }
    this.onRulesChange();
  }

  //
  // Events
  //
  onEventValue(event: EventMap) {
    this.getEventValues = event.getTypeahead();
  }
}

/** @ngInject */
export function mappingOptionsTab($q, uiSegmentSrv) {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: `${$GF.plugin.getPartialPath()}/mapping/index.html`,
    controller: MappingOptionsCtrl,
  };
}

class GFTable {
  parentDiv : HTMLDivElement;
  tableData: gf.TTableData;
  tableDom : HTMLElement | undefined;
  pressed : boolean = false;
  headerTable: HTMLDivElement | undefined;
  bodyTable: HTMLDivElement | undefined;
  indexTable: number = 0;
  startX: number = 0;
  startWidth: any = 0;

  constructor(table: gf.TTableData, div : HTMLDivElement) {
    this.tableData = table;
    this.parentDiv = div;
  }

  getWidth(id: string | number): string {
    return this.getColumnProperty(id,"size");
  }

  getLeft(id: string | number): string {
    let sizes = 0;
    let found = false;
    this.tableData.columns.forEach(c => {
      if (c.id !== id && found === false) {
        sizes += parseInt(c.size, 10);
      }
      if (c.id === id) {
        found = true;
      }
    });
    return `${sizes}px`;
  }

  getIndex(id : string):number {
    return this.getColumnProperty(id,'index');
  }

  getId(index : number):string {
    return this.getColumnProperty(index,'id');
  }

  getLabel(id: string| number): string {
    return this.getColumnProperty(id,'label');
  }

  getDesc(id: string| number): string {
    return this.getColumnProperty(id,'desc');
  }

  getColumnProperty(id: string| number, property : string): any {
    let result = `No value for properti ${property}`;
    const isNumber = (typeof(id) === 'number');
    for (let index = 0; index < this.tableData.columns.length; index++) {
      const element = this.tableData.columns[index];
      if( (isNumber && id === element.index) || ( !isNumber && id === element.id)) {
        return element[property];
      } 
    }
    return result;
  }

  setColumnProperty(id: string| number, property : string, value:any):this {
    const isNumber = (typeof(id) === 'number');
    for (let index = 0; index < this.tableData.columns.length; index++) {
      const element = this.tableData.columns[index];
      if( (isNumber && id === element.index) || ( !isNumber && id === element.id)) {
        element[property] = value;
      } 
    }
    return this;
  }

  getElement(element) {
    console.log('GFTable -> getElement -> element', element);
    debugger
  }

  onMouseMove(event: MouseEvent) {
    if (this.pressed && this.headerTable && this.headerTable.parentNode) {
      const decaleColumns = function(node : HTMLElement | null) {
        while (node !== null) {
          const prec = node.previousElementSibling as HTMLElement;
          let newLeft = 0;
          if (prec) {
            newLeft = parseInt(prec.style.width, 10) + parseInt(prec.style.left, 10);
          }
          node.style.left = `${newLeft}px`;
          node = node.nextElementSibling as HTMLElement;
        }
      }
      const delta = event.pageX - this.startX;
      const width = this.startWidth + delta;
      this.headerTable.style.width = `${width}px`;
      decaleColumns(<HTMLElement>this.headerTable.nextElementSibling)

      if (this.bodyTable) {
        const rows = this.bodyTable.querySelectorAll('.GF_table-rows');
        Array.from(rows).forEach(r => {
          const cells = r.querySelectorAll('.GF_table-cells');
          let index = 0;
          let prec: HTMLElement | null = null;
          cells.forEach( cell  => {
            const node = <HTMLElement> cell;
            if(index == this.indexTable) {
              node.style.width = `${width}px`;
              prec = node;
              this.setColumnProperty(index,'size', `${width}px`);
            }
            if (index > this.indexTable && prec !== null) {
              const newLeft = parseInt(prec.style.width, 10) + parseInt(prec.style.left, 10);
              node.style.left = `${newLeft}px`;
              prec = node;
            }
            index += 1;
          });
        });
      }
    }
  }

  onMouseDown(event: any) {
    this.pressed = true;
    this.startX = event.pageX;
    console.log('onMouseDown',event);
    this.headerTable = event.currentTarget.parentElement;
    if (this.headerTable) {
      if (this.headerTable.parentNode) {
        this.indexTable = Array.from(this.headerTable.parentNode.children).indexOf(this.headerTable);
      }
      this.headerTable.classList.add('GF_resizing');
      this.startWidth = parseInt(this.headerTable.style.width, 10);
      this.bodyTable = <HTMLDivElement>this.parentDiv.getElementsByClassName('GF_table-body')[0];
    }
  }

  onMouseUp(event: MouseEvent) {
    this.pressed = false;
    if (this.headerTable) {
      this.headerTable.classList.remove('GF_resizing');
    }
  }
}
