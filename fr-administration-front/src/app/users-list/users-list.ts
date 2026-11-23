import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
  imports: [MatTableModule],
  selector: 'app-users-list',
  styleUrl: './users-list.scss',
  templateUrl: './users-list.html',
})
export class UsersList implements OnInit{
  displayedColumns: string[] = ['id', 'lastname', 'firstname', 'age'];
  dataSource = [];
  
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

    ngOnInit() : void {
      const request: Observable<any> = this.http.get('http://localhost:3000/users', { observe: 'response' });
      lastValueFrom(request).then(response => {this.dataSource = response.body; this.cdr.detectChanges()});
  }
}
