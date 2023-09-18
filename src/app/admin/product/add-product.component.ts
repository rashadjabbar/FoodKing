import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 12, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 13, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 14, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 15, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 16, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 17, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 18, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 19, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 20, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 21, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 22, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 23, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 24, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 25, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 26, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 27, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 28, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
  ];

  activeRow: any = -1;
  selectedId: any = 0;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  isActive = (index: number) => { return this.activeRow === index };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  highlight(index: number, id: number): void {
    if (!this.isActive(index)) {
      this.activeRow = index;
      this.selectedId = id;
    }
    else {
      this.activeRow = -1;
      this.selectedId = 0;
    }
  }
}
