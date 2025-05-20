import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicInputComponent } from '../../ui/dynamic-input/dynamic-input.component';
import { User } from '../../../interfaces/user';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { APIService } from '../../../services/api.service';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicInputComponent],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.css',
})
export class SearchUserComponent implements OnInit, OnDestroy {
  searchTerm = '';
  isLoading = false;

  @Output() searchResultsChange = new EventEmitter<User[]>(); // proper output

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term || term.length < 2) {
            this.searchResultsChange.emit([]);
            return of([]);
          }
          this.isLoading = true;
          return this.apiService
            .GET_All(`/User/searchUsersByEmail?searchTerm=${encodeURIComponent(term)}`)
            .pipe(
              catchError((err) => {
                console.error('Error searching users:', err);
                return of([]);
              })
            );
        })
      )
      .subscribe({
        next: (results) => {
          this.isLoading = false;
          this.searchResultsChange.emit(results || []);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Subscription error:', error);
          this.searchResultsChange.emit([]);
        },
      });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
