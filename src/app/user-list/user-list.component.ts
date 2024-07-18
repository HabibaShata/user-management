import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [CommonModule],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'username', 'email'];
  dataSource: User[] = [];
  filteredData: User[] = [];
  isLoading = true;
  currentPage = 1;
  itemsPerPage = 10;
  pages: number[] = [];
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.dataSource = data;
      this.filteredData = [...this.dataSource];
      this.isLoading = false;
      this.calculatePages();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredData = this.dataSource.filter(user =>
      user.name.toLowerCase().includes(filterValue) ||
      user.username.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
    this.calculatePages();
  }

  sortData(column: string) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.filteredData.sort((a, b) => {
      const aValue = a[column as keyof User];
      const bValue = b[column as keyof User];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
    });
    this.calculatePages();
  }

  calculatePages() {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  hasPreviousPage() {
    return this.currentPage > 1;
  }

  hasNextPage() {
    return this.currentPage < this.pages.length;
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }

  onSelect(user: User): void {
    this.router.navigate(['/user', user.id]);
  }
}
