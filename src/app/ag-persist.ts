import { BodyScrollEndEvent, ColDef, Column, ColumnApi, ColumnState, DragStoppedEvent, FilterChangedEvent, FirstDataRenderedEvent, GridApi, GridOptions, SortChangedEvent } from "ag-grid-community";
import { AgGridPersistorComponent } from "./components/ag-grid-persistor/ag-grid-persistor.component";

type GridSettings = {
  columnState: ColumnState[];
  groupState: {
    groupId: string;
    open: boolean;
  }[];
  filterState: {
    [key: string]: any;
  };
};
type ScrollPosition = {
  topIndex: number;
  leftColumn: string;
};

export class AgPersist {
  private gridReady = false;
  private gridId = '';

  /**
   * AG Grid Persist
   * @param gridId - this must be a unique name app wide
   */
  constructor(gridId: string) {
    this.gridId = gridId;
  }

  /**
   * We can easily change the storage mechanism at any point (i.e. use api endpoint, session storage...).
   * It would be an easy update since getting and saving column state is in its own functions.
   */
  private saveGridSettings(columnApi: ColumnApi, gridApi: GridApi) {
    /**
     * Btw, this right here is the reason we cannot use a static class. To apply filters, we need to wait
     * until onFirstDataRendered has been called and as a result, this saveGridSettings function might be
     * called first. We don't want to do any saving until then otherwise it will overwrite our saved
     * settings.
     */
    if (this.gridReady !== true)
      return;

    const state = {
      columnState: columnApi.getColumnState(),
      groupState: columnApi.getColumnGroupState(),
      filterState: gridApi.getFilterModel(),
    } as GridSettings;
    const json = JSON.stringify(state);
    localStorage.setItem(`ag-persist-grid-settings-${this.gridId}`, json);
  }
  private getGridSettings() {
    return JSON.parse(localStorage.getItem(`ag-persist-grid-settings-${this.gridId}`)) as GridSettings;
  }

  public resetGridSettings(){
        const json = JSON.stringify('');
        localStorage.setItem(`ag-persist-grid-settings-${this.gridId}`, json);
  }

  private saveGridPosition(event: BodyScrollEndEvent) {
    if (this.gridReady !== true)
      return;

    const allVisibleColumnsNotPinned = event.columnApi
      .getAllDisplayedColumns()
      .filter(c => c.isPinned() !== true && c.isVisible() === true) as Column<any>[];
    const secondLeftMostColumn = allVisibleColumnsNotPinned
      .findIndex(c => c.getLeft() > event.left);
    const scrollInfo = {
      topIndex: event.api.getModel().getRowIndexAtPixel(event.top),
      leftColumn: secondLeftMostColumn <= 1 ? undefined : allVisibleColumnsNotPinned[secondLeftMostColumn - 1].getId(),
    } as ScrollPosition;
    const json = JSON.stringify(scrollInfo);
    localStorage.setItem(`ag-persist-scroll-position-${this.gridId}`, json);
  }
  private getScrollPosition() {
    return JSON.parse(localStorage.getItem(`ag-persist-scroll-position-${this.gridId}`)) as ScrollPosition;
  }

  /**
   * When we call applyColumnState, the columns flicker. You can see them move into place. The only way to bypass that
   * is if you set the grid option, suppressColumnMoveAnimation: true. But we might want grid animations. There is no
   * easy way to turn this back on after the grid state has been restored. To fix this, we force disable css animations
   * on the grid cells.
   */
  private disableGridAnimations() {
    const style = document.createElement('style');
    style.innerHTML = '.ag-header-cell, .ag-cell-value { transition: none !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    return style;
  }

  private enableGridAnimations(styleObject: HTMLStyleElement) {
    setTimeout(() => {
      document.getElementsByTagName('head')[0].removeChild(styleObject);
    }, 500)
  }

  /**
   * Use this on any ag grid to persist customized column order, filter, and sorting options.
   * @param gridOptions - the ag grid options you want
   * @returns grid options
   * 
   * Example:
   *    private gridOptions = AgPersist.setup('my-unique-id', {
   *      /* your grid options *\/
   *    });
   */
  public setup(gridOptions: GridOptions) {
    const animationResponse = this.disableGridAnimations();

    return {
      ...gridOptions,
      onDragStopped: (params: DragStoppedEvent<any, any>) => {
        this.saveGridSettings(params.columnApi, params.api);
        if (gridOptions.onDragStopped)
          gridOptions.onDragStopped(params);
      },
      onFilterChanged: (params: FilterChangedEvent<any, any>) => {
        this.saveGridSettings(params.columnApi, params.api);
        if (gridOptions.onFilterChanged)
          gridOptions.onFilterChanged(params);
      },
      onSortChanged: (params: SortChangedEvent<any, any>) => {
        this.saveGridSettings(params.columnApi, params.api);
        if (gridOptions.onSortChanged)
          gridOptions.onSortChanged(params);
      },
      onFirstDataRendered: (params) => {
        this.gridReady = true;
        const columnState = this.getGridSettings();
        if (columnState)
          params.api.setFilterModel(columnState.filterState);

        const scrollPosition = this.getScrollPosition();
        if (scrollPosition) {
          params.api.ensureIndexVisible(scrollPosition.topIndex, 'top');
          params.api.ensureColumnVisible(scrollPosition.leftColumn, 'start');
        }

        if (gridOptions.onFirstDataRendered)
          return gridOptions.onFirstDataRendered(params);
      },
      onGridReady: (params: FirstDataRenderedEvent<any, any>) => {
        const columnState = this.getGridSettings();
        if (columnState) {
          params.columnApi.applyColumnState({ state: columnState.columnState, applyOrder: true });
          params.columnApi.setColumnGroupState(columnState.groupState);
          this.enableGridAnimations(animationResponse);
          params.api.setSideBarPosition
        }

        if (gridOptions.onGridReady)
          gridOptions.onGridReady(params);
      },
      onBodyScrollEnd: (event: BodyScrollEndEvent<any, any>) => {
        this.saveGridPosition(event);
        
        if (gridOptions.onBodyScrollEnd)
          gridOptions.onBodyScrollEnd(event);
      },
    } as GridOptions;
  };
}